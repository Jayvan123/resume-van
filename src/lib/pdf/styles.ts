import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Times-Roman',
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
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#475569',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  entrySubTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#475569',
  },
  entryDate: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
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
