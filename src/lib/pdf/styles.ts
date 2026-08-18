import { StyleSheet, Font } from '@react-pdf/renderer';

// Register Poppins font from Google Fonts CDN
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecnFHGPezSQ.ttf' }, // Regular
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z11lFd2JQEl8qw.ttf', fontWeight: 'bold' }, // Bold
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiGyp8kv8JHgFVrJJLed3FBGPaTSA.ttf', fontStyle: 'italic' }, // Italic
  ],
});

export const getPdfStyles = (fontName: string) => {
  // Map user fonts to react-pdf supported standard fonts
  // Calibri, Arial, Helvetica -> Helvetica
  // Times New Roman, Georgia, Cambria -> Times-Roman
  // Poppins -> Poppins (custom registered)
  const pdfFont = ['Times New Roman', 'Georgia', 'Cambria'].includes(fontName)
    ? 'Times-Roman'
    : (fontName === 'Poppins' ? 'Poppins' : 'Helvetica');

  const pdfFontBold = pdfFont === 'Times-Roman' ? 'Times-Bold' : (pdfFont === 'Poppins' ? 'Poppins' : 'Helvetica-Bold');
  const pdfFontItalic = pdfFont === 'Times-Roman' ? 'Times-Italic' : (pdfFont === 'Poppins' ? 'Poppins' : 'Helvetica-Oblique');

  const fontWeightBold = pdfFont === 'Poppins' ? 'bold' : 'normal';
  const fontStyleItalic = pdfFont === 'Poppins' ? 'italic' : 'normal';

  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: pdfFont,
      lineHeight: 1.5,
      color: '#333333',
    },
    headerContainer: {
      borderBottomWidth: 1.5,
      borderBottomColor: '#000000',
      paddingBottom: 8,
      marginBottom: 12,
      alignItems: 'center',
    },
    fullName: {
      fontSize: 20,
      fontFamily: pdfFontBold,
      fontWeight: fontWeightBold,
      color: '#0f172a',
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    titleText: {
      fontSize: 9.5,
      fontFamily: pdfFontBold,
      fontWeight: fontWeightBold,
      color: '#334155',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 5,
      textAlign: 'center',
    },
    contactDetails: {
      fontSize: 8,
      fontFamily: pdfFont,
      color: '#475569',
      textAlign: 'center',
    },
    sectionContainer: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: pdfFontBold,
      fontWeight: fontWeightBold,
      textTransform: 'uppercase',
      color: '#0f172a',
      borderBottomWidth: 0.5,
      borderBottomColor: '#cbd5e1',
      paddingBottom: 2,
      marginBottom: 6,
      letterSpacing: 0.8,
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.4,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: 9.5,
      fontFamily: pdfFontBold,
      fontWeight: fontWeightBold,
      color: '#0f172a',
    },
    entrySubTitle: {
      fontSize: 9,
      fontFamily: pdfFontItalic,
      fontStyle: fontStyleItalic,
      color: '#475569',
    },
    entryDate: {
      fontSize: 8.5,
      fontFamily: pdfFont,
      color: '#64748b',
    },
    entryDescription: {
      fontSize: 9,
      paddingLeft: 6,
      borderLeftWidth: 1,
      borderLeftColor: '#f1f5f9',
      color: '#334155',
      marginBottom: 6,
    },
    skillsText: {
      fontSize: 9.5,
    },
    bulletList: {
      paddingLeft: 10,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    bulletDot: {
      width: 6,
      fontSize: 8,
    },
    bulletContent: {
      flex: 1,
      fontSize: 9,
    }
  });
};
