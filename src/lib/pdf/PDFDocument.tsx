import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume.types';
import { getPdfStyles } from './styles';

interface PDFDocumentProps {
  data: ResumeData;
  selectedFont: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({ data, selectedFont }) => {
  const { personal, experience, education, skills, certifications } = data;
  const pdfStyles = getPdfStyles(selectedFont);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.fullName}>{personal.fullName || 'Your Name'}</Text>
          {personal.title ? (
            <Text style={pdfStyles.titleText}>{personal.title}</Text>
          ) : null}
          <View style={pdfStyles.contactDetails}>
            <Text>
              {[personal.location, personal.email, personal.phone]
                .filter(Boolean)
                .join('  |  ')}
            </Text>
          </View>
        </View>

        {/* Summary */}
        {personal.summary ? (
          <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.sectionTitle}>Professional Summary</Text>
            <Text style={pdfStyles.summaryText}>{personal.summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {experience.length > 0 ? (
          <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, index) => (
              <View key={exp.id || index} style={{ marginBottom: 6 }}>
                <View style={pdfStyles.entryHeader}>
                  <Text style={pdfStyles.entryTitle}>
                    {exp.role}
                    <Text style={pdfStyles.entrySubTitle}>  —  {exp.company}</Text>
                  </Text>
                  <Text style={pdfStyles.entryDate}>{exp.dates}</Text>
                </View>
                {exp.description ? (
                  <Text style={pdfStyles.entryDescription}>{exp.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {education.length > 0 ? (
          <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={edu.id || index} style={{ marginBottom: 4 }}>
                <View style={pdfStyles.entryHeader}>
                  <View>
                    <Text style={pdfStyles.entryTitle}>{edu.school}</Text>
                    <Text style={pdfStyles.entrySubTitle}>{edu.degree}</Text>
                  </View>
                  <Text style={pdfStyles.entryDate}>{edu.dates}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {skills.length > 0 ? (
          <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.sectionTitle}>Skills</Text>
            <Text style={pdfStyles.skillsText}>{skills.join('  ·  ')}</Text>
          </View>
        ) : null}

        {/* Certifications */}
        {certifications.length > 0 ? (
          <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.sectionTitle}>Certifications</Text>
            <View style={pdfStyles.bulletList}>
              {certifications.map((cert, index) => (
                <View key={index} style={pdfStyles.bulletItem}>
                  <Text style={pdfStyles.bulletDot}>•</Text>
                  <Text style={pdfStyles.bulletContent}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
