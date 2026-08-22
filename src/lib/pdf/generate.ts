import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '@/types/resume.types';

const FONT_MAPPING: Record<string, string> = {
  Poppins: "'Poppins', sans-serif",
  Calibri: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  Arial: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  'Times New Roman': "'Times New Roman', Times, Baskerville, Georgia, serif",
  Georgia: 'Georgia, serif',
  Cambria: 'Cambria, Georgia, serif',
};

/** Escape HTML special characters */
const esc = (s: string | undefined | null): string =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Builds a fully self-contained HTML document string for the resume.
 * Every style is inlined so that html2canvas never has to parse any external
 * stylesheet (which would encounter the app's oklch() / color-mix() CSS Color 4
 * values that html2canvas cannot handle, resulting in a blank white capture).
 */
const buildResumeHtml = (data: ResumeData, selectedFont: string): string => {
  const fontFamily =
    FONT_MAPPING[selectedFont] || "Arial, 'Helvetica Neue', Helvetica, sans-serif";

  const contactItems = [
    data.personal.location,
    data.personal.email,
    data.personal.phone,
    ...(data.personal.links || []),
  ].filter(Boolean);

  const contactHtml = contactItems
    .map(
      (item, idx) =>
        idx < contactItems.length - 1
          ? `<span>${esc(item)}</span><span style="color:#cbd5e1;margin:0 6px;">|</span>`
          : `<span>${esc(item)}</span>`,
    )
    .join('');

  const titlesHtml =
    data.personal.titles && data.personal.titles.length > 0
      ? `<div style="font-size:13px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">${esc(data.personal.titles.join(' | '))}</div>`
      : '';

  const sectionHeader = (title: string) =>
    `<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#1e293b;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin-bottom:8px;margin-top:0;">${title}</h2>`;

  const experienceHtml = data.experience
    .map(
      (exp) => `
      <div style="margin-bottom:14px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:2px;">
          <div>
            <span style="font-size:13.5px;font-weight:700;color:#0f172a;">${esc(exp.role)}</span>
            <span style="font-size:13px;color:#475569;margin-left:6px;">&#8212; ${esc(exp.company)}</span>
          </div>
          <span style="font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0;">${esc(exp.dates)}</span>
        </div>
        ${exp.description ? `<div style="font-size:12.5px;line-height:1.625;color:#334155;white-space:pre-line;padding-left:12px;border-left:1px solid #e2e8f0;margin-top:4px;">${esc(exp.description)}</div>` : ''}
      </div>`,
    )
    .join('');

  const educationHtml = data.education
    .map(
      (edu) => `
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:10px;">
        <div>
          <span style="font-size:13.5px;font-weight:700;color:#0f172a;">${esc(edu.school)}</span>
          <p style="font-size:12.5px;color:#475569;margin:2px 0 0;">${esc(edu.degree)}</p>
        </div>
        <span style="font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0;">${esc(edu.dates)}</span>
      </div>`,
    )
    .join('');

  const fontImport =
    selectedFont === 'Poppins'
      ? '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  ${fontImport}
  <style>
    /* Match the app's Tailwind preflight (html { line-height: 1.5 }), which the
       live preview inherits on every element. Without this, this iframe falls
       back to the browser's default line-height (~1.15), rendering every
       heading/paragraph visibly tighter than the on-screen preview. */
    html { line-height: 1.5; }
    * { box-sizing: border-box; margin: 0; padding: 0; line-height: inherit; }
    body { background: #ffffff; }
  </style>
</head>
<body>
  <div id="resume-root" style="font-family:${fontFamily};width:794px;min-height:1123px;background:#ffffff;color:#0f172a;padding:40px;">
    <header style="padding-bottom:12px;margin-bottom:16px;text-align:center;">
      <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.02em;line-height:1;color:#0f172a;margin-bottom:6px;">${esc(data.personal.fullName) || 'YOUR NAME'}</h1>
      ${titlesHtml}
      <div style="display:flex;flex-wrap:wrap;justify-content:center;font-size:12px;color:#475569;">${contactHtml}</div>
    </header>
    ${data.personal.summary ? `<section style="margin-bottom:16px;">${sectionHeader('Professional Summary')}<p style="font-size:13px;line-height:1.625;color:#334155;">${esc(data.personal.summary)}</p></section>` : ''}
    ${data.experience.length ? `<section style="margin-bottom:16px;">${sectionHeader('Work Experience')}${experienceHtml}</section>` : ''}
    ${data.education.length ? `<section style="margin-bottom:16px;">${sectionHeader('Education')}${educationHtml}</section>` : ''}
    ${data.skills.length ? `<section style="margin-bottom:16px;">${sectionHeader('Skills')}<p style="font-size:13px;line-height:1.625;color:#334155;">${esc(data.skills.join(' \xB7 '))}</p></section>` : ''}
    ${data.certifications.length ? `<section>${sectionHeader('Certifications')}${data.certifications.map((c) => `<div style="display:flex;align-items:baseline;margin-bottom:4px;"><span style="font-size:13px;color:#334155;width:16px;flex-shrink:0;">&#8226;</span><span style="font-size:13px;color:#334155;">${esc(c)}</span></div>`).join('')}</section>` : ''}
  </div>
</body>
</html>`;
};

/** Wait for `document.fonts.ready`, but also force-load the specific weights
 *  the resume uses, since `fonts.ready` can resolve before an external
 *  Google Fonts <link> stylesheet has actually finished fetching. Bounded by
 *  a timeout so a slow/blocked network never hangs the export. */
const waitForFonts = async (doc: Document, fontFamily: string, weights: number[]) => {
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000));

  const loadAll = (async () => {
    try {
      await doc.fonts.ready;
    } catch {
      // fonts API unavailable, fall through
    }
    if (fontFamily === 'Poppins') {
      try {
        await Promise.all(
          weights.map((w) => doc.fonts.load(`${w} 12px Poppins`)),
        );
      } catch {
        // ignore — worst case we fall back to the system font
      }
    }
  })();

  await Promise.race([loadAll, timeout]);
};

/**
 * Renders resume HTML into an off-screen iframe and captures it with html2canvas.
 * The iframe has NO connection to the app stylesheet, so html2canvas never
 * encounters oklch() / color-mix() values — the root cause of blank PDF output.
 */
const captureResumeIframe = (
  html: string,
  selectedFont: string,
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    // Off-screen but NOT display:none � html2canvas requires the element to be visible
    iframe.style.cssText =
      'position:fixed;top:0;left:-9999px;width:794px;height:1123px;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    const cleanup = () => {
      try {
        document.body.removeChild(iframe);
      } catch {
        // already removed
      }
    };

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          cleanup();
          reject(new Error('Could not access iframe document'));
          return;
        }

        const targetEl = iframeDoc.getElementById('resume-root');
        if (!targetEl) {
          cleanup();
          reject(new Error('Resume root element not found in iframe'));
          return;
        }

        // Wait for fonts before capturing
        await waitForFonts(iframeDoc, selectedFont, [400, 500, 600, 700, 800]);

        const html2canvasFn = (html2canvas as any).default || html2canvas;
        const canvas = await html2canvasFn(targetEl, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          windowHeight: 1123,
        });

        cleanup();
        resolve(canvas);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    iframe.onerror = () => {
      cleanup();
      reject(new Error('iframe failed to load'));
    };

    iframe.srcdoc = html;
  });
};

export const downloadPDF = async (
  data: ResumeData,
  selectedFont: string,
  customFileName?: string,
): Promise<void> => {
  try {
    const jsPDFFn = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;

    const html = buildResumeHtml(data, selectedFont);
    const canvas = await captureResumeIframe(html, selectedFont);

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDFFn('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale the full captured canvas to the PDF's page width, preserving its
    // aspect ratio, so its full (possibly multi-page-tall) height is known.
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Paginate: place the same full-height image on each page, shifted up by
    // one page height each time. jsPDF clips content that falls outside the
    // current page, so each page shows only its own slice — this avoids
    // squashing a multi-page resume into a single stretched page.
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

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
