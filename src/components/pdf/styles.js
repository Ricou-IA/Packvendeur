import { StyleSheet } from '@react-pdf/renderer';

// Colors
const PRIMARY = '#0c4a6e';
const PRIMARY_LIGHT = '#0ea5e9';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';
const TEXT_LIGHT = '#94a3b8';
const BORDER_LIGHT = '#e2e8f0';
const BORDER_MEDIUM = '#cbd5e1';
const BG_SUBTLE = '#f8fafc';
const BG_TABLE_HEADER = '#f1f5f9';
const WHITE = '#ffffff';

export const styles = StyleSheet.create({
  // ─── Page & Layout ──────────────────────────────────────────
  page: {
    padding: 40,
    paddingBottom: 60,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT_DARK,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_LIGHT,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // ─── Cover Page ─────────────────────────────────────────────
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    marginBottom: 6,
    letterSpacing: 2,
  },
  coverSubtitle: {
    fontSize: 10,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: 400,
  },
  coverLegalRef: {
    fontSize: 9,
    color: TEXT_LIGHT,
    textAlign: 'center',
    fontFamily: 'Helvetica-Oblique',
    marginBottom: 30,
  },
  coverInfoBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: BG_SUBTLE,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  coverInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  coverInfoLabel: {
    fontSize: 9,
    color: TEXT_MUTED,
    width: 120,
  },
  coverInfoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    flex: 1,
  },
  coverLogo: {
    marginBottom: 20,
    alignItems: 'center',
  },

  // ─── Part / Section Headers ─────────────────────────────────
  partTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  subSection: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    marginTop: 14,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_LIGHT,
  },
  subSectionSmall: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    marginTop: 10,
    marginBottom: 6,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: BORDER_MEDIUM,
  },

  // ─── Data Rows ──────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: BG_TABLE_HEADER,
  },
  rowAlternate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: BG_TABLE_HEADER,
    backgroundColor: BG_SUBTLE,
  },
  label: {
    fontSize: 9,
    color: TEXT_MUTED,
    flex: 2,
  },
  value: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    textAlign: 'right',
    flex: 1,
  },
  labelIndented: {
    fontSize: 9,
    color: TEXT_MUTED,
    flex: 2,
    paddingLeft: 12,
  },

  // ─── Tables ─────────────────────────────────────────────────
  table: {
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: BORDER_LIGHT,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LIGHT,
    paddingVertical: 5,
    paddingHorizontal: 4,
    minHeight: 22,
  },
  tableRowAlternate: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LIGHT,
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: BG_SUBTLE,
    minHeight: 22,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BG_TABLE_HEADER,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_MEDIUM,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
    color: TEXT_DARK,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
    color: TEXT_DARK,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    paddingHorizontal: 4,
  },
  tableCellHeaderRight: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    paddingHorizontal: 4,
    textAlign: 'right',
  },
  tableCellWide: {
    flex: 2,
    fontSize: 9,
    paddingHorizontal: 4,
    color: TEXT_DARK,
  },
  tableCellHeaderWide: {
    flex: 2,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    paddingHorizontal: 4,
  },

  // ─── Badges ─────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeRed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  badgeAmber: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  badgeGray: {
    backgroundColor: BORDER_LIGHT,
    color: '#475569',
  },
  badgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ─── DPE Color Badges ──────────────────────────────────────
  dpeA: { backgroundColor: '#16a34a', color: WHITE },
  dpeB: { backgroundColor: '#65a30d', color: WHITE },
  dpeC: { backgroundColor: '#eab308', color: TEXT_DARK },
  dpeD: { backgroundColor: '#f97316', color: WHITE },
  dpeE: { backgroundColor: '#ef4444', color: WHITE },
  dpeF: { backgroundColor: '#dc2626', color: WHITE },
  dpeG: { backgroundColor: '#991b1b', color: WHITE },

  // ─── Alerts ─────────────────────────────────────────────────
  alert: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 4,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  alertText: {
    fontSize: 8,
    color: '#92400e',
  },
  alertDanger: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 4,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  alertDangerText: {
    fontSize: 8,
    color: '#991b1b',
  },

  // ─── Info Box ───────────────────────────────────────────────
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: '#bfdbfe',
  },
  infoBoxText: {
    fontSize: 8,
    color: '#1e40af',
    lineHeight: 1.4,
  },

  // ─── Disclaimer ─────────────────────────────────────────────
  disclaimer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: BG_SUBTLE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
  },
  disclaimerText: {
    fontSize: 8,
    color: TEXT_MUTED,
    lineHeight: 1.5,
  },

  // ─── Signature ──────────────────────────────────────────────
  signatureBlock: {
    marginTop: 40,
  },
  signatureLabel: {
    fontSize: 10,
    color: TEXT_DARK,
    marginBottom: 6,
  },
  signatureLine: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: TEXT_MUTED,
    borderBottomStyle: 'dotted',
    width: 250,
  },

  // ─── Footer ─────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: BORDER_LIGHT,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: TEXT_LIGHT,
  },
  pageNumber: {
    fontSize: 7,
    color: TEXT_LIGHT,
    textAlign: 'right',
  },

  // ─── Text Helpers ───────────────────────────────────────────
  textSmall: {
    fontSize: 8,
    color: TEXT_MUTED,
  },
  textMuted: {
    fontSize: 9,
    color: TEXT_MUTED,
    lineHeight: 1.5,
  },
  textBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
  },
  textItalic: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: TEXT_MUTED,
  },
  textLegalParagraph: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.7,
    marginBottom: 12,
  },
  textCurrency: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    textAlign: 'right',
  },

  // ─── Spacing ────────────────────────────────────────────────
  spacer: {
    height: 10,
  },
  spacerLarge: {
    height: 20,
  },

  // ─── Annexe ─────────────────────────────────────────────────
  annexeItem: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BG_TABLE_HEADER,
  },
  annexeNumber: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    width: 25,
  },
  annexeType: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    width: 180,
  },
  annexeFilename: {
    fontSize: 8,
    color: TEXT_MUTED,
    flex: 1,
  },
});
