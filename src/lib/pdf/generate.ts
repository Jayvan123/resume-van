import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { ResumeData } from '@/types/resume.types';
import { PDFDocument } from './PDFDocument';

export const generatePDF = async (data: ResumeData, selectedFont: string): Promise<Blob> => {
  const doc = React.createElement(PDFDocument, { data, selectedFont });
  const blobInstance = pdf(doc as any);
  return await blobInstance.toBlob();
};

export const downloadPDF = async (data: ResumeData, selectedFont: string): Promise<void> => {
  try {
    const blob = await generatePDF(data, selectedFont);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const fileName = data.personal.fullName
      ? `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
