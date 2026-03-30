/**
 * Generates blank pré-état daté PDF templates for download.
 *
 * Run: node scripts/generate-blank-template.js
 *
 * Output:
 *   public/modele-pre-etat-date-vierge.pdf   — basic blank form (free download)
 *   public/modele-pre-etat-date-guide.pdf     — enriched with filling instructions (email required)
 */
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');

// ─── Colors ──────────────────────────────────────────────
const PRIMARY = '#0c4a6e';
const PRIMARY_LIGHT = '#0ea5e9';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';
const TEXT_LIGHT = '#94a3b8';
const BORDER_LIGHT = '#e2e8f0';
const BG_SUBTLE = '#f8fafc';
const BG_TABLE_HEADER = '#f1f5f9';
const WHITE = '#ffffff';
const GUIDE_BG = '#eff6ff';
const GUIDE_BORDER = '#bfdbfe';
const GUIDE_TEXT = '#1e40af';

const s = StyleSheet.create({
  page: { padding: 40, paddingBottom: 60, fontFamily: 'Helvetica', fontSize: 9, color: TEXT_DARK },
  footer: { position: 'absolute', bottom: 25, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: BORDER_LIGHT, paddingTop: 6 },
  footerText: { fontSize: 7, color: TEXT_LIGHT },

  // Cover
  coverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 6, letterSpacing: 2, textAlign: 'center' },
  coverSubtitle: { fontSize: 10, color: TEXT_MUTED, textAlign: 'center', marginBottom: 4 },
  coverLegal: { fontSize: 9, color: TEXT_LIGHT, textAlign: 'center', fontFamily: 'Helvetica-Oblique', marginBottom: 30 },
  coverBox: { width: '100%', maxWidth: 420, backgroundColor: BG_SUBTLE, borderWidth: 1, borderColor: BORDER_LIGHT, borderRadius: 4, padding: 16, marginBottom: 20 },
  coverRow: { flexDirection: 'row', marginBottom: 6 },
  coverLabel: { fontSize: 9, color: TEXT_MUTED, width: 130 },
  coverValue: { fontSize: 9, color: TEXT_DARK, flex: 1, borderBottomWidth: 1, borderBottomColor: BORDER_LIGHT, borderBottomStyle: 'dotted', paddingBottom: 2 },

  // Section headers
  partTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WHITE, backgroundColor: PRIMARY, paddingVertical: 8, paddingHorizontal: 12, marginTop: 16, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginTop: 16, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: BORDER_LIGHT },

  // Rows
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: BG_TABLE_HEADER },
  rowAlt: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: BG_TABLE_HEADER, backgroundColor: BG_SUBTLE },
  label: { fontSize: 9, color: TEXT_MUTED, flex: 2 },
  blankValue: { flex: 1, borderBottomWidth: 1, borderBottomColor: BORDER_LIGHT, borderBottomStyle: 'dotted', marginLeft: 8, minHeight: 14 },

  // Guide hints
  guideBox: { backgroundColor: GUIDE_BG, padding: 8, borderRadius: 3, marginBottom: 8, borderWidth: 0.5, borderColor: GUIDE_BORDER },
  guideText: { fontSize: 7.5, color: GUIDE_TEXT, lineHeight: 1.4, fontFamily: 'Helvetica-Oblique' },

  // Text
  textSmall: { fontSize: 8, color: TEXT_MUTED, marginBottom: 4 },
  textItalic: { fontSize: 8, fontFamily: 'Helvetica-Oblique', color: TEXT_MUTED },
});

// ─── Reusable Components ─────────────────────────────────

function PageFooter({ pageNum, totalPages }) {
  return React.createElement(View, { style: s.footer, fixed: true },
    React.createElement(Text, { style: s.footerText }, 'Pre-etat-date.ai — Modele pre-etat date vierge'),
    React.createElement(Text, { style: s.footerText }, `${pageNum} / ${totalPages}`),
  );
}

function BlankRow({ label, alt = false, guide = null }) {
  const items = [
    React.createElement(View, { style: alt ? s.rowAlt : s.row, key: 'row' },
      React.createElement(Text, { style: s.label }, label),
      React.createElement(View, { style: s.blankValue }),
    ),
  ];
  if (guide) {
    items.push(
      React.createElement(View, { style: s.guideBox, key: 'guide' },
        React.createElement(Text, { style: s.guideText }, `Aide : ${guide}`),
      ),
    );
  }
  return React.createElement(React.Fragment, null, ...items);
}

// ─── Template Generator ──────────────────────────────────

function generateTemplate(withGuide = false) {
  const g = withGuide ? (text) => text : () => null;

  // Cover Page
  const coverPage = React.createElement(Page, { size: 'A4', style: s.page },
    React.createElement(View, { style: s.coverContainer },
      React.createElement(Text, { style: s.coverTitle }, 'PRE-ETAT DATE'),
      React.createElement(Text, { style: s.coverSubtitle }, 'Modele vierge conforme au modele CSN'),
      React.createElement(Text, { style: s.coverLegal }, 'Article L.721-2 du Code de la Construction et de l\'Habitation'),
      React.createElement(View, { style: s.coverBox },
        ...[
          ['Adresse du bien :', ''],
          ['N\u00B0 de lot :', ''],
          ['Surface Carrez :', ''],
          ['Nom du vendeur :', ''],
          ['Nom de la copropriete :', ''],
          ['Syndic :', ''],
          ['Date d\'etablissement :', ''],
        ].map(([lbl], i) =>
          React.createElement(View, { style: s.coverRow, key: i },
            React.createElement(Text, { style: s.coverLabel }, lbl),
            React.createElement(View, { style: s.coverValue }),
          )
        ),
      ),
      withGuide
        ? React.createElement(View, { style: s.guideBox },
            React.createElement(Text, { style: s.guideText },
              'Guide : Remplissez les informations du bien et du vendeur. Le numero de lot et les tantiemes figurent dans le reglement de copropriete ou l\'etat descriptif de division.'
            ),
          )
        : null,
    ),
    React.createElement(PageFooter, { pageNum: 1, totalPages: withGuide ? 5 : 4 }),
  );

  // Page 2 — Financial
  const financialRows = [
    ['Budget previsionnel annuel', 'Montant total vote en AG (dernier PV).'],
    ['Tantiemes du lot (PCG)', 'Tantiemes de charges generales de votre lot. Voir reglement de copropriete.'],
    ['Tantiemes totaux de la copropriete', 'Total des tantiemes de l\'immeuble. Meme source.'],
    ['Charges courantes annuelles du lot', 'Calculez : (tantiemes lot / tantiemes totaux) x budget. Verifiez avec vos appels de fonds.'],
    ['Provisions exigibles (exercice en cours)', 'Montant deja appele pour l\'exercice en cours.'],
    ['Charges exceptionnelles votees non appelees', 'Travaux votes en AG mais dont les appels de fonds n\'ont pas encore ete emis.'],
    ['Impaye du vendeur', 'Si vous avez des charges impayees, indiquez le montant. Sinon, ecrivez 0 EUR.'],
    ['Dette de la copropriete (fournisseurs)', 'Consultez les annexes comptables ou la fiche synthetique.'],
    ['Fonds de travaux — solde', 'Solde du fonds ALUR. Voir la fiche synthetique ou les comptes.'],
    ['Fonds de travaux — cotisation annuelle', 'Montant annuel verse au fonds de travaux.'],
  ];

  const financialPage = React.createElement(Page, { size: 'A4', style: s.page },
    React.createElement(Text, { style: s.partTitle }, 'Partie I — Informations financieres'),
    withGuide
      ? React.createElement(View, { style: s.guideBox },
          React.createElement(Text, { style: s.guideText },
            'Source principale : appels de fonds trimestriels, releves de charges annuels, annexes comptables et fiche synthetique. Tous disponibles sur l\'extranet du syndic ou dans les courriers recus.'
          ),
        )
      : null,
    React.createElement(Text, { style: s.sectionTitle }, '1.1 Budget et charges'),
    ...financialRows.map(([lbl, hint], i) =>
      React.createElement(BlankRow, { key: i, label: lbl, alt: i % 2 === 1, guide: withGuide ? hint : null })
    ),
    React.createElement(PageFooter, { pageNum: 2, totalPages: withGuide ? 5 : 4 }),
  );

  // Page 3 — Copro / Legal
  const legalRows = [
    ['Nom du syndic en exercice', 'Nom du cabinet de syndic et coordonnees.'],
    ['Date de fin de mandat du syndic', 'Voir le PV de la derniere AG qui a designe le syndic.'],
    ['Nombre de lots principaux', 'Voir la fiche synthetique ou le reglement de copropriete.'],
    ['Nombre de coproprietes', 'Nombre total de coproprietaires. Fiche synthetique.'],
    ['Procedures judiciaires en cours', 'Indiquez OUI ou NON. Si oui, detaillez ci-dessous.'],
    ['Details des procedures', 'Nature, parties, tribunal. Consultez les PV d\'AG.'],
    ['Travaux votes non encore realises', 'Indiquez OUI ou NON. Si oui, detaillez ci-dessous.'],
    ['Details des travaux votes', 'Description, montant total, quote-part du lot. Voir PV d\'AG.'],
    ['Plan pluriannuel de travaux (PPT)', 'Indiquez si un PPT a ete vote. Obligatoire pour les copro > 200 lots depuis 2023.'],
  ];

  const legalPage = React.createElement(Page, { size: 'A4', style: s.page },
    React.createElement(Text, { style: s.partTitle }, 'Partie II-A — Vie de la copropriete'),
    withGuide
      ? React.createElement(View, { style: s.guideBox },
          React.createElement(Text, { style: s.guideText },
            'Source principale : les 3 derniers PV d\'assemblee generale, le reglement de copropriete et la fiche synthetique. Les procedures en cours sont souvent mentionnees dans le rapport du syndic annexe au PV.'
          ),
        )
      : null,
    React.createElement(Text, { style: s.sectionTitle }, '2.1 Syndic et organisation'),
    ...legalRows.slice(0, 4).map(([lbl, hint], i) =>
      React.createElement(BlankRow, { key: `a${i}`, label: lbl, alt: i % 2 === 1, guide: withGuide ? hint : null })
    ),
    React.createElement(Text, { style: s.sectionTitle }, '2.2 Procedures et travaux'),
    ...legalRows.slice(4).map(([lbl, hint], i) =>
      React.createElement(BlankRow, { key: `b${i}`, label: lbl, alt: i % 2 === 1, guide: withGuide ? hint : null })
    ),
    React.createElement(PageFooter, { pageNum: 3, totalPages: withGuide ? 5 : 4 }),
  );

  // Page 4 — Technical / Diagnostics
  const diagRows = [
    ['DPE — Classe energie (A-G)', 'Lettre de A a G. Voir le rapport DPE.'],
    ['DPE — Classe GES (A-G)', 'Emissions de gaz a effet de serre (A-G).'],
    ['DPE — Date de realisation', 'Format JJ/MM/AAAA. Attention : avant 01/07/2021 = non opposable.'],
    ['DPE — Numero ADEME', 'Numero a 13 chiffres en haut du rapport DPE.'],
    ['Diagnostic amiante — Date', 'Obligatoire si permis de construire avant le 1er juillet 1997.'],
    ['Diagnostic amiante — Resultat', 'Presence ou absence d\'amiante.'],
    ['Diagnostic plomb (CREP) — Date', 'Obligatoire si immeuble construit avant le 1er janvier 1949.'],
    ['Diagnostic electricite — Date', 'Obligatoire si installation > 15 ans.'],
    ['Diagnostic gaz — Date', 'Obligatoire si installation > 15 ans.'],
    ['ERP (Etat des Risques et Pollutions)', 'Date de realisation. Valable 6 mois.'],
    ['Mesurage Carrez — Surface', 'Surface en m\u00B2. Obligatoire pour tout lot en copropriete.'],
    ['DTG (Diagnostic Technique Global)', 'Indiquez si un DTG a ete realise. Date si existant.'],
  ];

  const diagPage = React.createElement(Page, { size: 'A4', style: s.page },
    React.createElement(Text, { style: s.partTitle }, 'Partie II-B — Informations techniques'),
    withGuide
      ? React.createElement(View, { style: s.guideBox },
          React.createElement(Text, { style: s.guideText },
            'Source : les rapports de diagnostics fournis par le diagnostiqueur. Le DPE peut etre verifie sur le site de l\'ADEME : observatoire-dpe.ademe.fr. Verifiez les dates de validite.'
          ),
        )
      : null,
    React.createElement(Text, { style: s.sectionTitle }, '3.1 DPE'),
    ...diagRows.slice(0, 4).map(([lbl, hint], i) =>
      React.createElement(BlankRow, { key: `d${i}`, label: lbl, alt: i % 2 === 1, guide: withGuide ? hint : null })
    ),
    React.createElement(Text, { style: s.sectionTitle }, '3.2 Diagnostics obligatoires'),
    ...diagRows.slice(4).map(([lbl, hint], i) =>
      React.createElement(BlankRow, { key: `e${i}`, label: lbl, alt: i % 2 === 1, guide: withGuide ? hint : null })
    ),
    React.createElement(PageFooter, { pageNum: 4, totalPages: withGuide ? 5 : 4 }),
  );

  const pages = [coverPage, financialPage, legalPage, diagPage];

  // Page 5 (guide only) — Signature + disclaimer
  if (withGuide) {
    const signaturePage = React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(Text, { style: s.partTitle }, 'Signature et attestation'),
      React.createElement(View, { style: { marginTop: 12 } },
        React.createElement(Text, { style: { fontSize: 9, color: TEXT_DARK, lineHeight: 1.6, marginBottom: 16 } },
          'Je soussigne(e) ................................., vendeur du lot n\u00B0 ......... de la copropriete ................................., certifie sur l\'honneur l\'exactitude des informations figurant dans le present document, etabli sur la base des documents de la copropriete en ma possession.'
        ),
        React.createElement(View, { style: s.coverRow },
          React.createElement(Text, { style: s.coverLabel }, 'Fait a :'),
          React.createElement(View, { style: s.coverValue }),
        ),
        React.createElement(View, { style: s.coverRow },
          React.createElement(Text, { style: s.coverLabel }, 'Le :'),
          React.createElement(View, { style: s.coverValue }),
        ),
        React.createElement(View, { style: { marginTop: 30, borderBottomWidth: 1, borderBottomColor: TEXT_MUTED, borderBottomStyle: 'dotted', width: 250 } }),
        React.createElement(Text, { style: { fontSize: 8, color: TEXT_MUTED, marginTop: 4 } }, 'Signature du vendeur'),
      ),
      React.createElement(View, { style: { marginTop: 40, padding: 12, backgroundColor: BG_SUBTLE, borderRadius: 4, borderWidth: 1, borderColor: BORDER_LIGHT } },
        React.createElement(Text, { style: { fontSize: 8, color: TEXT_MUTED, lineHeight: 1.5 } },
          'Avertissement : ce document est un modele vierge fourni a titre informatif par Pre-etat-date.ai. Il ne se substitue pas a un conseil juridique. Le vendeur est responsable de l\'exactitude des informations fournies. Pour un pre-etat date genere automatiquement a partir de vos documents, conforme au modele CSN et garanti satisfait ou rembourse, rendez-vous sur pre-etat-date.ai.'
        ),
      ),
      React.createElement(View, { style: s.guideBox },
        React.createElement(Text, { style: { fontSize: 8, color: GUIDE_TEXT, fontFamily: 'Helvetica-Bold', marginBottom: 4 } },
          'Gagnez du temps : laissez l\'IA le remplir pour vous'
        ),
        React.createElement(Text, { style: s.guideText },
          'Deposez vos PDF (PV d\'AG, releves de charges, DPE) sur pre-etat-date.ai. L\'intelligence artificielle extrait automatiquement toutes les donnees et genere un document conforme au modele CSN en 5 minutes, pour seulement 24,99 EUR. Garantie satisfait ou rembourse.'
        ),
      ),
      React.createElement(PageFooter, { pageNum: 5, totalPages: 5 }),
    );
    pages.push(signaturePage);
  }

  return React.createElement(Document, null, ...pages);
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('Generating blank PDF templates...');

  const basic = generateTemplate(false);
  const guide = generateTemplate(true);

  const [basicBuf, guideBuf] = await Promise.all([
    renderToBuffer(basic),
    renderToBuffer(guide),
  ]);

  const basicPath = path.join(PUBLIC, 'modele-pre-etat-date-vierge.pdf');
  const guidePath = path.join(PUBLIC, 'modele-pre-etat-date-guide.pdf');

  fs.writeFileSync(basicPath, basicBuf);
  fs.writeFileSync(guidePath, guideBuf);

  console.log(`  ✓ ${basicPath} (${(basicBuf.length / 1024).toFixed(1)} KB)`);
  console.log(`  ✓ ${guidePath} (${(guideBuf.length / 1024).toFixed(1)} KB)`);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Error generating PDF templates:', err);
  process.exit(1);
});
