const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  HeadingLevel, PageNumber, PageBreak, LevelFormat
} = require('docx');

const BLUE = '1E40AF';
const LIGHT_GRAY = 'F3F4F6';
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_MARGINS = { top: 60, bottom: 60, left: 100, right: 100 };

// A4 dimensions in DXA
const PAGE_WIDTH = 11906;
const MARGIN_LEFT = 1134; // ~2cm
const MARGIN_RIGHT = 1134;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 9638

function field(label, placeholder = '[A compl\u00e9ter]') {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 20, font: 'Arial' }),
      new TextRun({ text: `  ${placeholder}`, size: 20, font: 'Arial', color: '6B7280' }),
    ],
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: BLUE, space: 4 } },
    children: [
      new TextRun({ text, bold: true, size: 28, font: 'Arial', color: BLUE }),
    ],
  });
}

function subSectionTitle(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({ text, bold: true, size: 22, font: 'Arial', color: '374151' }),
    ],
  });
}

function checkboxLine(label) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 20, font: 'Arial' }),
      new TextRun({ text: '  \u2610 Oui   \u2610 Non', size: 20, font: 'Arial' }),
    ],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });
}

// Diagnostics table
function diagnosticsTable() {
  const headerRow = new TableRow({
    children: ['Diagnostic', 'Date', 'R\u00e9sultat / Classe', 'Validit\u00e9'].map((text, i) => {
      const widths = [3200, 2000, 2438, 2000];
      return new TableCell({
        borders: BORDERS,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR },
        margins: CELL_MARGINS,
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 18, font: 'Arial' })],
        })],
      });
    }),
  });

  const diagnostics = [
    'DPE', 'Amiante', 'Plomb (CREP)', '\u00c9lectricit\u00e9', 'Gaz',
    'ERP', 'Mesurage Carrez', 'Termites'
  ];

  const dataRows = diagnostics.map(name =>
    new TableRow({
      children: [name, '___/___/_____', '_____________', '_____________'].map((text, i) => {
        const widths = [3200, 2000, 2438, 2000];
        return new TableCell({
          borders: BORDERS,
          width: { size: widths[i], type: WidthType.DXA },
          margins: CELL_MARGINS,
          children: [new Paragraph({
            children: [new TextRun({
              text,
              size: 18,
              font: 'Arial',
              bold: i === 0,
              color: i === 0 ? '111827' : '6B7280',
            })],
          })],
        });
      }),
    })
  );

  return new Table({
    width: { size: 9638, type: WidthType.DXA },
    columnWidths: [3200, 2000, 2438, 2000],
    rows: [headerRow, ...dataRows],
  });
}

async function generate() {
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 20 } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: 16838 }, // A4
          margin: { top: 1134, right: MARGIN_RIGHT, bottom: 1134, left: MARGIN_LEFT },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 },
              children: [
                new TextRun({ text: 'PR\u00c9-\u00c9TAT DAT\u00c9', bold: true, size: 36, font: 'Arial', color: BLUE }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BLUE, space: 6 } },
              children: [
                new TextRun({
                  text: 'Article L.721-2 du Code de la Construction et de l\u2019Habitation',
                  size: 16, font: 'Arial', italics: true, color: '6B7280',
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB', space: 4 } },
              spacing: { before: 0 },
              children: [
                new TextRun({
                  text: 'Document \u00e9tabli sur la base des d\u00e9clarations du vendeur et des documents fournis \u2014 Mod\u00e8le conforme CSN',
                  size: 14, font: 'Arial', color: '9CA3AF', italics: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Page ', size: 14, font: 'Arial', color: '9CA3AF' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, font: 'Arial', color: '9CA3AF' }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ============ IDENTIFICATION DU LOT ============
        sectionTitle('IDENTIFICATION DU LOT'),
        field('Adresse du bien :'),
        field('N\u00b0 de lot :'),
        field('Tanti\u00e8mes :', '_________ / _________ (lot / total)'),
        field('Surface Carrez :', '_________ m\u00b2'),
        field('Nom de la copropri\u00e9t\u00e9 :'),
        field('Syndic en exercice :'),

        // ============ PARTIE I ============
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle('PARTIE I \u2014 INFORMATIONS FINANCI\u00c8RES'),

        subSectionTitle('A. Budget pr\u00e9visionnel'),
        field('Exercice du :', '___/___/_____ au ___/___/_____'),
        field('Montant du budget pr\u00e9visionnel annuel :', '_____________ \u20ac'),
        field('Quote-part du lot vendeur :', '_____________ \u20ac'),

        subSectionTitle('B. Charges courantes'),
        field('Montant des charges courantes annuelles du lot :', '_____________ \u20ac'),
        field('Dont provisions exigibles :', '_____________ \u20ac'),
        field('Dont provisions vers\u00e9es :', '_____________ \u20ac'),

        subSectionTitle('C. Charges exceptionnelles'),
        checkboxLine('Travaux vot\u00e9s non encore appel\u00e9s :'),
        field('Si oui, montant total :', '_____________ \u20ac'),
        field('Quote-part lot :', '_____________ \u20ac'),
        field('Description :'),

        subSectionTitle('D. Impay\u00e9s du vendeur'),
        checkboxLine('Le vendeur est-il \u00e0 jour de ses charges :'),
        field('Montant des impay\u00e9s :', '_____________ \u20ac'),

        subSectionTitle('E. Dettes de la copropri\u00e9t\u00e9'),
        field('Montant des dettes envers les fournisseurs :', '_____________ \u20ac'),

        subSectionTitle('F. Fonds de travaux (art. 14-2 loi 10/07/1965)'),
        field('Solde du fonds de travaux :', '_____________ \u20ac'),
        field('Cotisation annuelle :', '_____________ \u20ac'),

        // ============ PARTIE II-A ============
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle('PARTIE II-A \u2014 VIE DE LA COPROPRI\u00c9T\u00c9'),

        subSectionTitle('A. Proc\u00e9dures judiciaires'),
        checkboxLine('Proc\u00e9dures en cours :'),
        field('Si oui, description :'),
        emptyLine(),
        emptyLine(),

        subSectionTitle('B. Travaux d\u00e9cid\u00e9s non r\u00e9alis\u00e9s'),
        checkboxLine('Travaux vot\u00e9s en AG non encore r\u00e9alis\u00e9s :'),
        field('Si oui, description et montant :'),
        emptyLine(),
        emptyLine(),

        subSectionTitle('C. Plan pluriannuel de travaux'),
        checkboxLine('PPT adopt\u00e9 :'),
        field('Si oui, \u00e9ch\u00e9ance :'),

        // ============ PARTIE II-B ============
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle('PARTIE II-B \u2014 DONN\u00c9ES TECHNIQUES'),

        subSectionTitle('Diagnostics obligatoires'),
        diagnosticsTable(),

        emptyLine(),
        subSectionTitle('DPE (D\u00e9tails)'),
        field('N\u00b0 ADEME :'),
        field('Classe \u00e9nergie :', '____'),
        field('Classe GES :', '____'),
        field('Date de r\u00e9alisation :', '___/___/_____'),

        // ============ PARTIE II-C ============
        sectionTitle('PARTIE II-C \u2014 PROC\u00c9DURES ET SINISTRES'),
        checkboxLine('Sinistres d\u00e9clar\u00e9s :'),
        field('Description :'),
        emptyLine(),
        emptyLine(),

        // ============ SECTION VENDEUR ============
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle('ATTESTATION DU VENDEUR'),

        new Paragraph({
          spacing: { before: 120, after: 200 },
          children: [
            new TextRun({
              text: 'Je soussign\u00e9(e), certifie l\u2019exactitude des informations fournies dans le pr\u00e9sent document, \u00e9tabli conform\u00e9ment \u00e0 l\u2019article L.721-2 du Code de la Construction et de l\u2019Habitation.',
              size: 20, font: 'Arial',
            }),
          ],
        }),

        field('Nom du vendeur :'),
        field('Date :', '___/___/_____'),
        emptyLine(),
        emptyLine(),
        field('Signature :', ''),
        emptyLine(),
        emptyLine(),
        emptyLine(),

        // Subtle CTA
        new Paragraph({
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
          border: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB', space: 8 },
          },
          children: [
            new TextRun({
              text: 'Ce formulaire vous semble complexe ? ',
              size: 18, font: 'Arial', color: '6B7280', italics: true,
            }),
            new TextRun({
              text: 'Pre-etat-date.ai ',
              size: 18, font: 'Arial', color: BLUE, bold: true,
            }),
            new TextRun({
              text: 'g\u00e9n\u00e8re votre pr\u00e9-\u00e9tat dat\u00e9 automatiquement en 5 minutes (24,99 \u20ac).',
              size: 18, font: 'Arial', color: '6B7280', italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'https://pre-etat-date.ai',
              size: 18, font: 'Arial', color: BLUE,
            }),
          ],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('public/modele-pre-etat-date-vierge.docx', buffer);
  console.log('Word template generated: public/modele-pre-etat-date-vierge.docx');
}

generate().catch(console.error);
