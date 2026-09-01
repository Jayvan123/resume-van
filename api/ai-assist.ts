import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
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
- The professional summary (personal.summary) should be drawn from how the user describes themselves overall, if they do so — do not fabricate one from job history alone.`;

// Overridable via OPENAI_MODEL if this stops being available on your account
// or a newer/cheaper model becomes preferable — see platform.openai.com/docs/models.
// Must be a model that supports Structured Outputs (gpt-4o-mini / gpt-4o-2024-08-06
// or later all do).
const DEFAULT_MODEL = 'gpt-4o-mini';

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

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "AI Assist isn't configured on the server (missing OPENAI_API_KEY)." });
    return;
  }

  const client = new OpenAI();

  try {
    const completion = await client.chat.completions.parse({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      response_format: zodResponseFormat(aiExtractionSchema, 'resume_extraction'),
    });

    const message = completion.choices[0]?.message;

    if (message?.refusal) {
      res.status(422).json({ error: "The AI declined to process that text. Try rephrasing it." });
      return;
    }

    if (!message?.parsed) {
      res.status(502).json({ error: 'The AI returned an unexpected format. Please try again.' });
      return;
    }

    res.status(200).json({ data: message.parsed });
  } catch (error) {
    if (error instanceof OpenAI.AuthenticationError) {
      console.error('AI Assist: OpenAI authentication failed', error);
      res.status(500).json({ error: 'AI Assist is misconfigured on the server (invalid API key).' });
    } else if (error instanceof OpenAI.RateLimitError) {
      res.status(429).json({ error: 'AI Assist is receiving too many requests right now. Please try again shortly.' });
    } else if (error instanceof OpenAI.BadRequestError) {
      console.error('AI Assist: bad request to OpenAI', error);
      res.status(400).json({ error: "Couldn't process that text. Try shortening or rephrasing it." });
    } else if (error instanceof OpenAI.APIError) {
      console.error('AI Assist: OpenAI API error', error);
      res.status(502).json({ error: 'The AI service is temporarily unavailable. Please try again.' });
    } else {
      console.error('AI Assist: unexpected error', error);
      res.status(500).json({ error: 'Something went wrong while structuring your text. Please try again.' });
    }
  }
}
