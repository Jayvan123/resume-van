import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '@/types/resume.types';

// Matches a color function call, allowing one level of nested parens
// (e.g. color-mix(in oklch, var(--ring) 50%, transparent)).
const COLOR_FN_REGEX = /(oklch|oklab|lch|lab|color-mix|color)\([^()]*(?:\([^()]*\)[^()]*)*\)/gi;

// Shared 1x1 canvas used to force real color-space conversion. Canvas 2D's
// fillStyle setter/getter round-trips any CSS Color 4 syntax the browser
// understands into real pixel bytes, which is a reliable way to turn
// oklch()/lab()/color-mix() into plain rgb() that html2canvas can parse.
let probeCtx: CanvasRenderingContext2D | null = null;
const getProbeCtx = (): CanvasRenderingContext2D | null => {
  if (probeCtx) return probeCtx;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    probeCtx = canvas.getContext('2d', { willReadFrequently: true });
  } catch {
    probeCtx = null;
  }
  return probeCtx;
};

/** Paints a color string onto a 1x1 canvas and reads the pixel back as
 * rgb()/rgba(). Returns null if the browser can't resolve the value at all
 * (e.g. it still contains an unresolved var() reference). */
const toRgbString = (colorStr: string): string | null => {
  const ctx = getProbeCtx();
  if (!ctx) return null;
  const SENTINEL = 'rgb(18, 52, 86)'; // arbitrary, unlikely to occur naturally
  try {
    ctx.fillStyle = SENTINEL;
    ctx.fillStyle = colorStr;
    if (ctx.fillStyle === SENTINEL && colorStr !== SENTINEL) return null; // browser rejected it
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  } catch {
    return null;
  }
};

/** Replaces any oklch/lab/lch/color()/color-mix() calls inside a (possibly
 * composite, e.g. box-shadow) value with their rgb() equivalents. A match
 * that still references a CSS variable (only possible when sanitizing raw
 * stylesheet text, since getComputedStyle() already resolves vars) can't be
 * converted standalone, so it falls back to 'transparent' rather than
 * crashing the renderer. */
const sanitizeColorValue = (value: string): string =>
  value.replace(COLOR_FN_REGEX, (match) => {
    if (match.includes('var(')) return 'transparent';
    return toRgbString(match) ?? 'transparent';
  });

/** Walks every accessible stylesheet in `doc` and rewrites any declaration
 * whose value contains an oklch/lab/lch/color-mix() function into a plain
 * rgb()/rgba() equivalent. This is what actually fixes the html2canvas
 * "unsupported color function" crash: html2canvas parses the full CSSOM of
 * the document it renders (including rules that don't even apply to the
 * captured element, e.g. this app's globals.css theme variables), so a
 * single oklch() anywhere in any stylesheet can abort the whole capture —
 * per-element inline style overrides on the captured node alone don't help. */
const sanitizeDocumentStylesheets = (doc: Document) => {
  const processStyleRule = (rule: CSSStyleRule) => {
    const style = rule.style;
    for (let i = 0; i < style.length; i++) {
      const prop = style.item(i);
      const value = style.getPropertyValue(prop);
      if (!value) continue;
      const sanitized = sanitizeColorValue(value);
      if (sanitized !== value) {
        style.setProperty(prop, sanitized, style.getPropertyPriority(prop));
      }
    }
  };

  const walkRules = (rules: CSSRuleList) => {
    Array.from(rules).forEach((rule: any) => {
      if (rule.style) processStyleRule(rule);
      if (rule.cssRules) walkRules(rule.cssRules);
    });
  };

  Array.from(doc.styleSheets).forEach((sheet) => {
    try {
      walkRules(sheet.cssRules);
    } catch {
      // Cross-origin stylesheet (e.g. a font CDN) — inaccessible, skip.
    }
  });
};

export const downloadPDF = async (
  data: ResumeData,
  _selectedFont: string,
  customFileName?: string
): Promise<void> => {
  const element = document.getElementById('resume-preview-paper');
  if (!element) {
    console.error('Resume preview element not found');
    alert('Failed to generate PDF: Preview element not found.');
    return;
  }

  try {
    // Handle Vite ESM/CJS default wrapper differences
    const html2canvasFn = (html2canvas as any).default || html2canvas;
    const jsPDFFn = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;

    // html2canvas clones the whole document into an offscreen iframe before
    // rendering. `onclone` runs against that clone right before capture, so
    // we sanitize its stylesheets there rather than trying to pre-inline
    // colors on the live document (which html2canvas's own CSSOM parsing
    // would bypass anyway).
    const canvas = await html2canvasFn(element, {
      scale: 2.5, // High DPI scaling for crisp text
      useCORS: true, // Handle any external resource fetching
      logging: false,
      backgroundColor: '#ffffff', // Force white background
      onclone: (clonedDoc: Document) => {
        sanitizeDocumentStylesheets(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDFFn('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add image fitting the page dimensions exactly
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Sanitize filename
    let fileName = 'Resume.pdf';
    if (customFileName) {
      const sanitized = customFileName.trim().replace(/\s+/g, '_');
      fileName = sanitized.toLowerCase().endsWith('.pdf') ? sanitized : `${sanitized}.pdf`;
    } else if (data.personal.fullName) {
      fileName = `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    }

    pdf.save(fileName);
  } catch (error: any) {
    console.error('PDF generation error:', error);
    alert(`Failed to generate PDF. Error: ${error?.message || error}`);
  }
};
