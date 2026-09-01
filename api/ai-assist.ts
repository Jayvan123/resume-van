import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, ApiError } from '@google/genai';
import { z } from 'zod';
// Relative imports on purpose: this function is deployed standalone by
// Vercel, not bundled through Vite, so the `@/*` tsconfig alias doesn't apply.
import { aiExtractionSchema } from '../src/lib/validations/resume.schema';
import { MAX_CHARS } from '../src/constants/aiAssist';

const SYSTEM_PROMPT = `You turn a person's freeform, informal description of themselves into structured resume data.

Rules:
- Only use information the user's text actually states. Never invent employers, job titles, dates, schools, degrees, or skills that aren't mentioned.
- If a field isn't present in the text, omit it (for personal fields) or leave the array empty — do not guess or pad it.
- The input may be written in two very different styles, and you must handle both equally well:
  1. A structured paste: a bio paragraph, then job history, then education, then skills, roughly in that order.
  2. A rambling, unstructured, stream-of-consciousness narrative that jumps between topics, told in first person, with no clear section breaks.
  In both cases, extract whatever resume-relevant information is present, regardless of the order or format it appears in.
- For each job mentioned, combine any achievements, responsibilities, or bullet-like details into that entry's description as a coherent block of text.
- Do not editorialize, summarize opinions, or add commentary — extract facts about the person's background only.
- The professional summary (personal.summary) should be drawn from how the user describes themselves overall, if they do so — do not fabricate one from job history alone.
- Respond with JSON matching the provided schema only.`;

// Overridable via GEMINI_MODEL if this stops being available on your account
// or a newer/cheaper free-tier model becomes preferable — see
// https://ai.google.dev/gemini-api/docs/models for current model IDs and
// which ones are free-tier eligible.
const DEFAULT_MODEL = 'gemini-3.6-flash';

// zod v4's built-in JSON Schema converter — Gemini's `responseJsonSchema`
// accepts standard JSON Schema directly, so no separate schema library/DSL
// is needed here (unlike Gemini's older, now-deprecated `responseSchema`
// field, which used a proprietary OpenAPI-subset format).
const responseJsonSchema = z.toJSONSchema(aiExtractionSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

  if (!text) {
    res.status(400).json({ error: 'Please paste some text to structure first.' });
    return;
  }

  if (text.length > MAX_CHARS) {
    res.status(400).json({ error: `Text is too long — please keep it under ${MAX_CHARS.toLocaleString()} characters.` });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: "AI Assist isn't configured on the server (missing GEMINI_API_KEY)." });
    return;
  }

  const client = new GoogleGenAI({});

  try {
    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseJsonSchema,
      },
    });

    const raw = response.text;
    if (!raw) {
      res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
      return;
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      res.status(502).json({ error: 'The AI returned an unexpected format. Please try again.' });
      return;
    }

    const parsed = aiExtractionSchema.safeParse(json);
    if (!parsed.success) {
      console.error('AI Assist: response failed schema validation', parsed.error);
      res.status(502).json({ error: 'The AI returned data in an unexpected format. Please try again.' });
      return;
    }

    res.status(200).json({ data: parsed.data });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('AI Assist: Gemini API error', error.status, error.message);
      if (error.status === 401 || error.status === 403) {
        res.status(500).json({ error: 'AI Assist is misconfigured on the server (invalid API key).' });
      } else if (error.status === 429) {
        res.status(429).json({ error: 'AI Assist is receiving too many requests right now. Please try again shortly.' });
      } else if (error.status === 400) {
        res.status(400).json({ error: "Couldn't process that text. Try shortening or rephrasing it." });
      } else {
        res.status(502).json({ error: 'The AI service is temporarily unavailable. Please try again.' });
      }
    } else {
      console.error('AI Assist: unexpected error', error);
      res.status(500).json({ error: 'Something went wrong while structuring your text. Please try again.' });
    }
  }
}
