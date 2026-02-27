import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ─── Helpers ──────────────────────────────────────────────────

/** Singleton EUR formatter — avoid re-instantiating Intl.NumberFormat on every call */
const eurFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** Format a numeric value as EUR currency, replacing NBSP for @react-pdf */
function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : value;
  if (isNaN(num)) return '-';
  return eurFormatter.format(num).replace(/[\u00A0\u202F]/g, ' ');
}

/** Format a date value (ISO or DD/MM/YYYY) to readable French format */
function formatDate(value) {
  if (!value) return '-';
  try {
    // Handle DD/MM/YYYY
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split('/');
      return format(new Date(+y, +m - 1, +d), 'dd MMMM yyyy', { locale: fr });
    }
    // Handle ISO or YYYY-MM-DD
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return format(date, 'dd MMMM yyyy', { locale: fr });
  } catch {
    return String(value);
  }
}

/** Pick first non-null/undefined/empty value (preserves 0 and false) */
function pick(...values) {
  for (const v of values) {
    if (v !== null && v !== undefined && v !== '') return v;
  }
  return null;
}

/** Safely evaluate a boolean from various sources */
function pickBool(...values) {
  for (const v of values) {
    if (v === true || v === 'true' || v === 'OUI' || v === 'oui') return true;
    if (v === false || v === 'false' || v === 'NON' || v === 'non') return false;
  }
  return false;
}

/** Map document_type enum to French label */
const DOC_TYPE_LABELS = {
  pv_ag: "PV d'Assemblée Générale",
  reglement_copropriete: 'Règlement de copropriété',
  etat_descriptif_division: 'État descriptif de division',
  appel_fonds: 'Appel de fonds',
  releve_charges: 'Relevé de charges',
  carnet_entretien: "Carnet d'entretien",
  dpe: 'Diagnostic de Performance Énergétique (DPE)',
  diagnostic_amiante: "Diagnostic amiante (DTA)",
  diagnostic_plomb: 'Diagnostic plomb (CREP)',
  diagnostic_termites: 'Diagnostic termites',
  diagnostic_electricite: 'Diagnostic électricité',
  diagnostic_gaz: 'Diagnostic gaz',
  diagnostic_erp: "État des Risques et Pollutions (ERP)",
  diagnostic_mesurage: 'Mesurage Carrez',
  fiche_synthetique: 'Fiche synthétique',
  plan_pluriannuel: 'Plan pluriannuel de travaux',
  dtg: 'Diagnostic Technique Global (DTG)',
  other: 'Autre document',
};

function getDocTypeLabel(type) {
  return DOC_TYPE_LABELS[type] || (type ? type.replace(/_/g, ' ') : 'Document');
}

// ─── Reusable Components ──────────────────────────────────────

function PageFooter({ coproName, lotNumber }) {
  const name = coproName || 'Copropriété';
  const lot = lotNumber || '-';
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Pré-état daté - {name} - Lot {lot}
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

function PartTitle({ children }) {
  return (
    <View wrap={false}>
      <Text style={styles.partTitle}>{children}</Text>
    </View>
  );
}

function SubSection({ children }) {
  return <Text style={styles.subSection}>{children}</Text>;
}

function SubSectionSmall({ children }) {
  return <Text style={styles.subSectionSmall}>{children}</Text>;
}

function DataRow({ label, value, indented, alternate }) {
  return (
    <View style={alternate ? styles.rowAlternate : styles.row}>
      <Text style={indented ? styles.labelIndented : styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '-'}</Text>
    </View>
  );
}

function CurrencyRow({ label, value, indented, alternate }) {
  return (
    <View style={alternate ? styles.rowAlternate : styles.row}>
      <Text style={indented ? styles.labelIndented : styles.label}>{label}</Text>
      <Text style={styles.textCurrency}>{formatCurrency(value)}</Text>
    </View>
  );
}

function BooleanBadge({ value, yesText, noText }) {
  const isYes = pickBool(value);
  const badgeStyle = isYes
    ? { ...styles.badge, ...styles.badgeGreen }
    : { ...styles.badge, ...styles.badgeGray };
  return <Text style={badgeStyle}>{isYes ? (yesText || 'OUI') : (noText || 'NON')}</Text>;
}

function BooleanRow({ label, value, alternate }) {
  return (
    <View style={{ ...(alternate ? styles.rowAlternate : styles.row), alignItems: 'center' }}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <BooleanBadge value={value} />
      </View>
    </View>
  );
}

function DpeBadge({ classe }) {
  if (!classe) return <Text style={styles.textSmall}>-</Text>;
  const letter = String(classe).toUpperCase().charAt(0);
  const colorKey = `dpe${letter}`;
  const colorStyle = styles[colorKey] || styles.badgeGray;
  return (
    <Text style={{ ...styles.badge, ...colorStyle, fontSize: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
      {letter}
    </Text>
  );
}

function Spacer() {
  return <View style={styles.spacer} />;
}

// ─── PAGE 1: Cover ────────────────────────────────────────────

function CoverPage({ data, coproName, lotNumber }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  const address = pick(data.property_address, data.copropriete?.adresse);
  const surface = pick(data.property_surface, data.lot?.surface_carrez);
  const tantiemes = pick(data.tantiemes_lot, data.lot?.tantiemes_generaux);
  const tantTotal = pick(data.tantiemes_totaux, data.copropriete?.tantiemes_totaux);
  const syndic = pick(data.syndic_name, data.copropriete?.syndic_nom);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverContainer}>
        {/* Title block */}
        <Text style={styles.coverTitle}>PRÉ-ÉTAT DATÉ</Text>
        <Text style={styles.coverSubtitle}>
          Établi conformément à l'article L.721-2 du Code de la Construction et de l'Habitation
        </Text>
        <Text style={styles.coverLegalRef}>
          Loi ALUR n° 2014-366 du 24 mars 2014
        </Text>

        {/* Copropriete info box */}
        <View style={styles.coverInfoBox}>
          <Text style={{ ...styles.subSectionSmall, marginTop: 0, paddingLeft: 0, borderLeftWidth: 0, marginBottom: 10, textAlign: 'center' }}>
            Identification
          </Text>
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>Copropriété :</Text>
            <Text style={styles.coverInfoValue}>{coproName || '-'}</Text>
          </View>
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>Adresse :</Text>
            <Text style={styles.coverInfoValue}>{address || '-'}</Text>
          </View>
          {!!data.property_postal_code && (
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}></Text>
              <Text style={styles.coverInfoValue}>{data.property_postal_code} {data.property_city || ''}</Text>
            </View>
          )}
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>Syndic :</Text>
            <Text style={styles.coverInfoValue}>{syndic || '-'}</Text>
          </View>
          <View style={{ height: 8 }} />
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>Lot n° :</Text>
            <Text style={styles.coverInfoValue}>{lotNumber || '-'}</Text>
          </View>
          {!!surface && (
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Surface Carrez :</Text>
              <Text style={styles.coverInfoValue}>{surface} m²</Text>
            </View>
          )}
          {!!tantiemes && (
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Tantièmes :</Text>
              <Text style={styles.coverInfoValue}>
                {tantiemes}{tantTotal ? ` / ${tantTotal}` : ''}
              </Text>
            </View>
          )}
          <View style={{ height: 8 }} />
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>Vendeur :</Text>
            <Text style={styles.coverInfoValue}>{data.seller_name || '-'}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={{ fontSize: 10, color: '#64748b', marginTop: 10 }}>
          Date d'établissement : {today}
        </Text>
      </View>

      {/* Bottom reference */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Établi sur la base des documents fournis par le vendeur. Ce document ne se substitue pas
          à l'état daté délivré par le syndic de copropriété conformément à l'article 5 du décret
          n° 67-223 du 17 mars 1967.
        </Text>
      </View>

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGES 2-3: PARTIE I - Situation financiere du cedant ─────

function FinancialPages({ data, coproName, lotNumber }) {
  const fin = data.extracted_data?.financier ?? data.financier ?? {};
  const jur = data.extracted_data?.juridique ?? data.juridique ?? {};

  // Flat column picks
  const budgetPrev = pick(data.budget_previsionnel, fin.budget_previsionnel_annuel);
  const chargesCourantes = pick(data.charges_courantes, fin.charges_courantes_lot);
  const chargesExcep = pick(data.charges_exceptionnelles, fin.charges_exceptionnelles_lot);
  const fondsSolde = pick(data.fonds_travaux_balance, fin.fonds_travaux_solde);
  const fondsCotisation = pick(data.fonds_travaux_cotisation, fin.fonds_travaux_cotisation_annuelle);
  const fondsExists = pick(data.fonds_travaux_exists, fin.fonds_travaux_exists);
  const impayeVendeur = pick(data.impaye_vendeur, fin.impayes_vendeur);
  const detteGlobal = pick(data.dette_copro_fournisseurs, fin.dette_copro_fournisseurs);

  // CSN-specific columns
  const chargesBudgetN1 = pick(data.charges_budget_n1, fin.charges_budget_n1);
  const chargesBudgetN2 = pick(data.charges_budget_n2, fin.charges_budget_n2);
  const chargesHorsBudgetN1 = pick(data.charges_hors_budget_n1, fin.charges_hors_budget_n1);
  const chargesHorsBudgetN2 = pick(data.charges_hors_budget_n2, fin.charges_hors_budget_n2);
  const provisionsExigibles = pick(data.provisions_exigibles, fin.provisions_exigibles);
  const avancesReserve = pick(data.avances_reserve, fin.avances_reserve);
  const provisionsSpeciales = pick(data.provisions_speciales, fin.provisions_speciales);
  const empruntSolde = pick(data.emprunt_collectif_solde, fin.emprunt_collectif_solde);
  const empruntObjet = pick(data.emprunt_collectif_objet, fin.emprunt_collectif_objet);
  const empruntEcheance = pick(data.emprunt_collectif_echeance, fin.emprunt_collectif_echeance);
  const cautionnement = pick(data.cautionnement_solidaire, fin.cautionnement_solidaire);
  const impayeChargesGlobal = pick(data.impaye_charges_global, fin.impaye_charges_global);
  const detteFournisseursGlobal = pick(data.dette_fournisseurs_global, fin.dette_fournisseurs_global);

  const tantiemesLot = pick(data.tantiemes_lot, data.lot?.tantiemes_generaux);
  const tantiemesTotaux = pick(data.tantiemes_totaux, data.copropriete?.tantiemes_totaux);

  return (
    <Page size="A4" style={styles.page}>
      <PartTitle>PARTIE I - SITUATION FINANCIÈRE DU CÉDANT</PartTitle>

      {/* Quote-part de charges */}
      <SubSection>Quote-part de charges du lot</SubSection>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeaderWide}>Description</Text>
          <Text style={styles.tableCellHeaderRight}>Exercice N-1</Text>
          <Text style={styles.tableCellHeaderRight}>Exercice N-2</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellWide}>Budget prévisionnel (charges courantes)</Text>
          <Text style={styles.tableCellRight}>{formatCurrency(chargesBudgetN1)}</Text>
          <Text style={styles.tableCellRight}>{formatCurrency(chargesBudgetN2)}</Text>
        </View>
        <View style={styles.tableRowAlternate}>
          <Text style={styles.tableCellWide}>Hors budget prévisionnel (charges exceptionnelles)</Text>
          <Text style={styles.tableCellRight}>{formatCurrency(chargesHorsBudgetN1)}</Text>
          <Text style={styles.tableCellRight}>{formatCurrency(chargesHorsBudgetN2)}</Text>
        </View>
      </View>

      <Spacer />

      {/* I. Sommes dues par le cedant */}
      <SubSection>I. Sommes dues par le copropriétaire cédant</SubSection>
      <SubSectionSmall>A/ Au syndicat, au titre de :</SubSectionSmall>

      <CurrencyRow
        label="1. Provisions exigibles du budget prévisionnel"
        value={provisionsExigibles}
      />
      <CurrencyRow
        label="2. Charges impayées sur exercices antérieurs"
        value={impayeVendeur}
        alternate
      />
      <CurrencyRow
        label="3. Avance constituant la réserve (art. 45-1)"
        value={avancesReserve}
      />
      <CurrencyRow
        label="4. Provisions spéciales (art. 18-6)"
        value={provisionsSpeciales}
        alternate
      />
      <CurrencyRow
        label="5. Cotisation au fonds de travaux (art. L.14-2)"
        value={fondsCotisation}
      />
      <CurrencyRow
        label="6. Emprunt collectif (quote-part restant due)"
        value={empruntSolde}
        alternate
      />
      {!!empruntObjet && (
        <View style={{ paddingLeft: 12, marginBottom: 4 }}>
          <Text style={styles.textItalic}>Objet : {empruntObjet}</Text>
          {!!empruntEcheance && (
            <Text style={styles.textItalic}>Échéance : {empruntEcheance}</Text>
          )}
        </View>
      )}
      {cautionnement !== null && cautionnement !== undefined && (
        <BooleanRow label="Cautionnement solidaire" value={cautionnement} />
      )}

      <Spacer />

      {/* II. Sommes incombant au nouveau coproprietaire */}
      <SubSection>II. Sommes incombant au nouveau copropriétaire</SubSection>

      <CurrencyRow
        label="Reconstitution des avances"
        value={avancesReserve}
      />
      <CurrencyRow
        label="Budget prévisionnel annuel"
        value={budgetPrev}
        alternate
      />

      {/* Tantiemes */}
      {!!tantiemesLot && (
        <DataRow
          label="Tantièmes du lot (parties communes générales)"
          value={`${tantiemesLot} / ${tantiemesTotaux || '-'}`}
        />
      )}

      <CurrencyRow
        label="Charges courantes du lot (annuel)"
        value={chargesCourantes}
        alternate
      />

      {/* Charges calculees annotation */}
      {!!data.charges_calculees && !!tantiemesLot && !!tantiemesTotaux && (
        <View style={{ paddingLeft: 12, marginBottom: 4 }}>
          <Text style={styles.textItalic}>
            Calcul : ({tantiemesLot} / {tantiemesTotaux}) x {formatCurrency(budgetPrev)} = {formatCurrency(data.charges_calculees)}
          </Text>
          {data.charges_discrepancy_pct > 5 && (
            <View style={{ ...styles.alert, marginTop: 4 }}>
              <Text style={styles.alertText}>
                Écart de {data.charges_discrepancy_pct}% entre le montant déclaré et le calcul par tantièmes.
              </Text>
            </View>
          )}
        </View>
      )}

      <CurrencyRow
        label="Charges exceptionnelles"
        value={chargesExcep}
      />

      <Spacer />

      {/* Etat global des impayes */}
      <SubSection>État global des impayés de la copropriété</SubSection>
      <BooleanRow
        label="Impayés de charges au sein du syndicat"
        value={impayeChargesGlobal}
      />
      {!!impayeChargesGlobal && typeof impayeChargesGlobal !== 'boolean' && (
        <View style={{ paddingLeft: 12 }}>
          <Text style={styles.textSmall}>Montant : {formatCurrency(impayeChargesGlobal)}</Text>
        </View>
      )}
      <BooleanRow
        label="Dettes du syndicat envers les fournisseurs"
        value={detteFournisseursGlobal}
        alternate
      />
      {!!detteGlobal && (
        <View style={{ paddingLeft: 12 }}>
          <Text style={styles.textSmall}>Montant : {formatCurrency(detteGlobal)}</Text>
        </View>
      )}

      <Spacer />

      {/* Fonds de travaux */}
      <SubSection>Fonds de travaux (art. L.14-2)</SubSection>
      <BooleanRow
        label="Existence du fonds de travaux"
        value={fondsExists}
      />
      <CurrencyRow
        label="Solde du fonds de travaux"
        value={fondsSolde}
        alternate
      />
      <CurrencyRow
        label="Dernière cotisation annuelle"
        value={fondsCotisation}
      />

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGES 4-5: PARTIE II-A - Vie de la copropriete ──────────

function CoproLifePages({ data, coproName, lotNumber }) {
  const fin = data.extracted_data?.financier ?? data.financier ?? {};
  const jur = data.extracted_data?.juridique ?? data.juridique ?? {};
  const copro = data.extracted_data?.copropriete ?? data.copropriete ?? {};

  const syndicName = pick(data.syndic_name, copro.syndic_nom);
  const syndicType = pick(data.syndic_type, copro.syndic_type);
  const syndicMandat = pick(data.syndic_mandat_fin, copro.syndic_mandat_fin);
  const prochaineAg = pick(data.prochaine_ag_date, copro.prochaine_ag_date, jur.prochaine_ag_date);
  const dateConstruction = pick(data.date_construction, copro.date_construction);
  const nombreLots = pick(data.nombre_lots_copropriete, copro.nombre_lots);
  const assuranceMri = pick(data.assurance_multirisque, copro.assurance_multirisque);
  const assuranceNumero = pick(data.assurance_numero_contrat, copro.assurance_numero_contrat);
  const coproDifficulte = pick(data.copropriete_en_difficulte, copro.copropriete_en_difficulte);
  const coproDifficulteDetails = pick(data.copropriete_difficulte_details, copro.copropriete_difficulte_details);
  const fibreOptique = pick(data.fibre_optique, copro.fibre_optique);

  // Travaux votes en AG
  const travauxVotes = jur.travaux_a_venir_votes || [];

  // Exercice en cours
  const exEnCours = fin.exercice_en_cours || {};
  const exPrecedent = fin.exercice_precedent || {};

  return (
    <Page size="A4" style={styles.page}>
      <PartTitle>PARTIE II - INFORMATIONS COMPLÉMENTAIRES</PartTitle>
      <Text style={styles.subSection}>A - Vie de la copropriété</Text>

      <DataRow label="Date de construction" value={dateConstruction ? formatDate(dateConstruction) : '-'} />
      <DataRow label="Nombre de lots" value={nombreLots ?? '-'} alternate />
      <DataRow
        label="Syndic"
        value={`${syndicName || '-'}${syndicType ? ` (${syndicType})` : ''}`}
      />
      <DataRow label="Fin de mandat du syndic" value={syndicMandat ? formatDate(syndicMandat) : '-'} alternate />
      <DataRow label="Prochaine Assemblée Générale" value={prochaineAg ? formatDate(prochaineAg) : '-'} />
      <DataRow
        label="Assurance multirisque immeuble (MRI)"
        value={assuranceMri ? `OUI${assuranceNumero ? ` (n° ${assuranceNumero})` : ''}` : (assuranceMri === false ? 'NON' : '-')}
        alternate
      />
      <BooleanRow label="Copropriété en difficulté (art. 29-1A)" value={coproDifficulte} />
      {pickBool(coproDifficulte) && coproDifficulteDetails && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>{coproDifficulteDetails}</Text>
        </View>
      )}
      <BooleanRow label="Fibre optique" value={fibreOptique} alternate />

      <Spacer />

      {/* Travaux votes en AG */}
      <SubSection>Travaux votés en Assemblée Générale</SubSection>

      {travauxVotes.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeaderWide}>Description</Text>
            <Text style={styles.tableCellHeaderRight}>Montant total</Text>
            <Text style={styles.tableCellHeaderRight}>Quote-part lot</Text>
          </View>
          {travauxVotes.map((t, i) => {
            const isAlt = i % 2 === 1;
            if (typeof t === 'string') {
              return (
                <View key={i} style={isAlt ? styles.tableRowAlternate : styles.tableRow}>
                  <Text style={styles.tableCellWide}>{t}</Text>
                  <Text style={styles.tableCellRight}>-</Text>
                  <Text style={styles.tableCellRight}>-</Text>
                </View>
              );
            }
            const desc = t.description || t.label || 'Travaux';
            return (
              <View key={i} style={isAlt ? styles.tableRowAlternate : styles.tableRow}>
                <Text style={styles.tableCellWide}>{desc}</Text>
                <Text style={styles.tableCellRight}>{formatCurrency(t.montant_total)}</Text>
                <Text style={styles.tableCellRight}>{formatCurrency(t.quote_part_lot)}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.textMuted}>Aucun travaux voté à signaler.</Text>
      )}

      <Spacer />

      {/* Exercice en cours */}
      <SubSection>Exercice en cours</SubSection>
      {exEnCours.debut || exEnCours.fin ? (
        <>
          <DataRow label="Période" value={`${exEnCours.debut || '-'} au ${exEnCours.fin || '-'}`} />
          <CurrencyRow label="Provisions appelées" value={exEnCours.provisions_appelees} alternate />
          <CurrencyRow label="Provisions versées" value={exEnCours.provisions_versees} />
        </>
      ) : (
        <Text style={styles.textMuted}>Informations non disponibles.</Text>
      )}

      <Spacer />

      {/* Exercice precedent */}
      <SubSection>Exercice précédent</SubSection>
      {exPrecedent.debut || exPrecedent.fin ? (
        <>
          <DataRow label="Période" value={`${exPrecedent.debut || '-'} au ${exPrecedent.fin || '-'}`} />
          <CurrencyRow label="Charges réelles" value={exPrecedent.charges_reelles} alternate />
          <CurrencyRow label="Quote-part du lot" value={exPrecedent.quote_part_lot} />
        </>
      ) : (
        <Text style={styles.textMuted}>Informations non disponibles.</Text>
      )}

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGES 6-7: PARTIE II-B - Dossier technique ──────────────

function TechnicalPages({ data, coproName, lotNumber }) {
  const diag = data.extracted_data?.diagnostics ?? data.diagnostics ?? {};
  const copro = data.extracted_data?.copropriete ?? data.copropriete ?? {};

  const dtgDate = pick(data.dtg_date, diag.dtg_date, copro.dtg_date);
  const dtgResultat = pick(data.dtg_resultat, diag.dtg_resultat, copro.dtg_resultat);
  const planExists = pick(data.plan_pluriannuel_exists, copro.plan_pluriannuel_exists);
  const planDetails = pick(data.plan_pluriannuel_details, copro.plan_pluriannuel_details);
  const dpeDate = pick(data.dpe_date, diag.dpe_date);
  const dpeEnergie = pick(data.dpe_classe_energie, diag.dpe_classe_energie);
  const dpeGes = pick(data.dpe_classe_ges, diag.dpe_classe_ges);
  const dpeAdeme = pick(data.dpe_ademe_number, diag.dpe_numero_ademe);
  const dpeValidity = data.dpe_validity_status;
  const amianteDate = pick(data.amiante_dta_date, diag.amiante_dta_date);
  const plombDate = pick(data.plomb_date, diag.plomb_date);
  const termitesDate = pick(data.termites_date, diag.termites_date);
  const auditDate = pick(data.audit_energetique_date, diag.audit_energetique_date);
  const ascenseurExists = pick(data.ascenseur_exists, copro.ascenseur_exists);
  const ascenseurDate = pick(data.ascenseur_rapport_date, copro.ascenseur_rapport_date);
  const piscineExists = pick(data.piscine_exists, copro.piscine_exists);
  const rechargeVehicules = pick(data.recharge_vehicules, copro.recharge_vehicules);

  // Table data for diagnostics
  const diagnosticRows = [
    { doc: 'Diagnostic Technique Global (DTG)', date: dtgDate, obs: dtgResultat },
    { doc: 'Plan pluriannuel de travaux', date: null, obs: planExists != null ? (pickBool(planExists) ? `OUI${planDetails ? ` - ${planDetails}` : ''}` : 'NON') : '-' },
    { doc: 'DPE', date: dpeDate, obs: dpeEnergie ? `Énergie : ${dpeEnergie} / GES : ${dpeGes || '-'}` : '-' },
    { doc: 'Amiante (DTA)', date: amianteDate, obs: null },
    { doc: 'Plomb (CREP)', date: plombDate, obs: null },
    { doc: 'Termites', date: termitesDate, obs: null },
    { doc: 'Audit énergétique', date: auditDate, obs: null },
    { doc: 'Ascenseur', date: ascenseurDate, obs: ascenseurExists != null ? (pickBool(ascenseurExists) ? 'OUI' : 'NON') : '-' },
    { doc: 'Piscine', date: null, obs: piscineExists != null ? (pickBool(piscineExists) ? 'OUI' : 'NON') : '-' },
    { doc: 'Recharge véhicules électriques', date: null, obs: rechargeVehicules != null ? (pickBool(rechargeVehicules) ? 'OUI' : 'NON') : '-' },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.subSection}>B - Dossier technique et environnemental</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeaderWide}>Document</Text>
          <Text style={styles.tableCellHeader}>Date</Text>
          <Text style={styles.tableCellHeader}>Observations</Text>
        </View>
        {diagnosticRows.map((row, i) => {
          const rowStyle = i % 2 === 1 ? styles.tableRowAlternate : styles.tableRow;
          return (
            <View key={i} style={rowStyle}>
              <Text style={styles.tableCellWide}>{row.doc}</Text>
              <Text style={styles.tableCell}>{row.date ? formatDate(row.date) : '-'}</Text>
              <Text style={styles.tableCell}>{row.obs || '-'}</Text>
            </View>
          );
        })}
      </View>

      <Spacer />

      {/* DPE Detail Box */}
      {!!(dpeDate || dpeEnergie || dpeAdeme) && (
        <View wrap={false}>
          <SubSection>Détail du DPE</SubSection>
          <View style={styles.infoBox}>
            {!!dpeAdeme && (
              <Text style={styles.infoBoxText}>Numéro ADEME : {dpeAdeme}</Text>
            )}
            {!!dpeDate && (
              <Text style={styles.infoBoxText}>Date : {formatDate(dpeDate)}</Text>
            )}

            {/* Energy + GES badges */}
            {!!dpeEnergie && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...styles.textSmall, marginRight: 4 }}>Classe énergie :</Text>
                  <DpeBadge classe={dpeEnergie} />
                </View>
                {!!dpeGes && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...styles.textSmall, marginRight: 4 }}>Classe GES :</Text>
                    <DpeBadge classe={dpeGes} />
                  </View>
                )}
              </View>
            )}

            {/* Validity alerts */}
            {dpeValidity === 'not_opposable' && (
              <View style={{ ...styles.alert, marginTop: 8 }}>
                <Text style={styles.alertText}>
                  Ce DPE est antérieur au 01/07/2021 et n'est pas opposable.
                  Il est fourni à titre informatif uniquement.
                </Text>
              </View>
            )}
            {dpeValidity === 'expired' && (
              <View style={{ ...styles.alertDanger, marginTop: 8 }}>
                <Text style={styles.alertDangerText}>
                  Ce DPE est expiré. Un nouveau DPE doit être réalisé avant la vente.
                </Text>
              </View>
            )}
            {dpeValidity === 'expiring_soon' && (
              <View style={{ ...styles.alert, marginTop: 8 }}>
                <Text style={styles.alertText}>
                  Ce DPE expire dans moins de 6 mois.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Loi Climat */}
      <View wrap={false} style={{ marginTop: 10 }}>
        <SubSectionSmall>Rappel - Loi Climat et Résilience</SubSectionSmall>
        <Text style={styles.textMuted}>
          Interdictions de location selon la classe DPE :{'\n'}
          - Classe G : interdiction depuis le 1er janvier 2025{'\n'}
          - Classe F : interdiction à compter du 1er janvier 2028{'\n'}
          - Classe E : interdiction à compter du 1er janvier 2034
        </Text>
      </View>

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGE 8: PARTIE II-C - Procedures en cours ───────────────

function ProceduresPage({ data, coproName, lotNumber }) {
  const jur = data.extracted_data?.juridique ?? data.juridique ?? {};

  const proceduresEnCours = pickBool(data.procedures_en_cours, jur.procedures_en_cours);
  const proceduresDetails = pick(data.procedures_details, jur.procedures_details);
  const travauxNonRealises = pickBool(data.travaux_votes_non_realises, jur.travaux_votes_non_realises);
  const travauxDetails = pick(data.travaux_details, jur.travaux_votes_details);
  const sinistres = pickBool(jur.sinistres_en_cours);
  const sinistresDetails = pick(jur.sinistres_details);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.subSection}>C - Procédures en cours</Text>

      <Spacer />

      {/* Procedures en cours */}
      <View wrap={false}>
        <View style={{ ...styles.row, alignItems: 'center' }}>
          <Text style={{ ...styles.label, fontFamily: 'Helvetica-Bold', color: '#1e293b' }}>
            Procédures judiciaires en cours
          </Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <BooleanBadge value={proceduresEnCours} />
          </View>
        </View>
        {proceduresEnCours && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              {proceduresDetails || 'Détails non précisés par le vendeur.'}
            </Text>
          </View>
        )}
      </View>

      <Spacer />

      {/* Travaux votes non realises */}
      <View wrap={false}>
        <View style={{ ...styles.row, alignItems: 'center' }}>
          <Text style={{ ...styles.label, fontFamily: 'Helvetica-Bold', color: '#1e293b' }}>
            Travaux votés non encore réalisés
          </Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <BooleanBadge value={travauxNonRealises} />
          </View>
        </View>
        {travauxNonRealises && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              {travauxDetails || 'Détails non précisés par le vendeur.'}
            </Text>
          </View>
        )}
      </View>

      <Spacer />

      {/* Sinistres */}
      <View wrap={false}>
        <View style={{ ...styles.row, alignItems: 'center' }}>
          <Text style={{ ...styles.label, fontFamily: 'Helvetica-Bold', color: '#1e293b' }}>
            Sinistres en cours
          </Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <BooleanBadge value={sinistres} />
          </View>
        </View>
        {sinistres && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              {sinistresDetails || 'Détails non précisés.'}
            </Text>
          </View>
        )}
      </View>

      <Spacer />

      {/* Legal text */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxText}>
          Les sommes éventuellement à recevoir ou à payer au titre des procédures en cours
          restent acquises ou à la charge du syndicat des copropriétaires, sauf dispositions
          contraires figurant dans la promesse ou le compromis de vente.
        </Text>
      </View>

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGE 9: ANNEXE - Documents transmis ─────────────────────

function AnnexePage({ data, coproName, lotNumber }) {
  const documents = Array.isArray(data.documents) ? data.documents : [];
  // Filter out documents without a filename
  const validDocs = documents.filter((d) => d.original_filename);

  return (
    <Page size="A4" style={styles.page}>
      <PartTitle>ANNEXE : DOCUMENTS TRANSMIS</PartTitle>

      <Spacer />

      {validDocs.length > 0 ? (
        <View>
          <Text style={styles.textMuted}>
            Liste des {validDocs.length} document{validDocs.length > 1 ? 's' : ''} fourni{validDocs.length > 1 ? 's' : ''} par le vendeur :
          </Text>
          <Spacer />
          {validDocs.map((doc, i) => (
            <View key={doc.id || i} style={styles.annexeItem}>
              <Text style={styles.annexeNumber}>{i + 1}.</Text>
              <Text style={styles.annexeType}>
                {getDocTypeLabel(doc.document_type)}
              </Text>
              <Text style={styles.annexeFilename}>
                {doc.original_filename}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.textMuted}>Aucun document transmis.</Text>
      )}

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGE: QUESTIONNAIRE VENDEUR (conditionnel) ─────────────

const QUESTIONNAIRE_LABELS = {
  civilite: 'Civilité',
  nom: 'Nom',
  nom_naissance: 'Nom de naissance',
  prenoms: 'Prénom(s)',
  date_naissance: 'Date de naissance',
  lieu_naissance: 'Lieu de naissance',
  nationalite: 'Nationalité',
  profession: 'Profession',
  situation_matrimoniale: 'Situation matrimoniale',
  regime_matrimonial: 'Régime matrimonial',
  date_mariage: 'Date de mariage/PACS',
  adresse: 'Adresse',
  code_postal: 'Code postal',
  ville: 'Ville',
  telephone: 'Téléphone',
  email: 'Email',
  resident_fiscal_france: 'Résident fiscal en France',
  pays_residence_fiscale: 'Pays de résidence fiscale',
  occupant_actuel: 'Occupation actuelle',
  bail_en_cours: 'Bail en cours',
  bail_type: 'Type de bail',
  bail_date_debut: 'Date début bail',
  bail_date_fin: 'Date fin bail',
  loyer_mensuel: 'Loyer mensuel',
  depot_garantie: 'Dépôt de garantie',
  conge_delivre: 'Congé délivré',
  conge_date: 'Date du congé',
  libre_a_la_vente: 'Libre à la vente',
  volume_ou_lotissement: 'Volume ou lotissement',
  association_syndicale: 'ASL / AFUL',
  association_syndicale_details: 'Détails ASL/AFUL',
  modifications_depuis_achat: 'Modifications depuis achat',
  modifications_details: 'Détails modifications',
  autorisations_urbanisme: 'Autorisations urbanisme',
  autorisations_details: 'Détails autorisations',
  travaux_realises: 'Travaux réalisés',
  travaux_realises_details: 'Détails travaux',
  travaux_autorises_ag: 'Travaux autorisés AG',
  travaux_conformes: 'Travaux conformes',
  travaux_conformes_details: 'Détails conformité',
  saisie_en_cours: 'Saisie en cours',
  saisie_details: 'Détails saisie',
  pret_hypothecaire: 'Prêt hypothécaire',
  pret_hypothecaire_details: 'Détails prêt',
  credit_relais: 'Crédit-relais',
  credit_relais_details: 'Détails crédit-relais',
  pret_a_taux_zero: 'PTZ',
  residence_principale: 'Résidence principale',
  duree_detention: 'Durée de détention',
  travaux_deductibles: 'Travaux déductibles',
  travaux_deductibles_montant: 'Montant travaux',
  acquisition_donation_succession: 'Donation/Succession',
  acquisition_details: 'Détails acquisition',
  premiere_cession: 'Première cession',
  dispositif_fiscal: 'Dispositif fiscal',
  dispositif_details: 'Détails dispositif',
  tva_recuperee: 'TVA récupérée',
  societe_civile: 'Société civile',
  societe_civile_details: 'Détails SCI',
  climatisation: 'Climatisation',
  alarme: 'Alarme',
  chaudiere_recente: 'Chaudière récente',
  chaudiere_date: 'Date chaudière',
  cheminee_insert: 'Cheminée/Insert',
  piscine_privative: 'Piscine privative',
  detecteur_fumee: 'Détecteur fumée',
  cave: 'Cave',
  parking: 'Parking',
  parking_numero: 'N° parking',
  balcon_terrasse: 'Balcon/Terrasse',
  sinistre_indemnise: 'Sinistre indemnisé',
  sinistre_details: 'Détails sinistre',
  catastrophe_naturelle: 'Catastrophe naturelle',
  catastrophe_details: 'Détails catastrophe',
  degat_des_eaux: 'Dégât des eaux',
  degat_details: 'Détails dégât',
  motif_vente: 'Motif de vente',
  motif_details: 'Détails motif',
  delai_souhaite: 'Délai souhaité',
};

const SECTION_LABELS = {
  vendeur1: 'Vendeur 1',
  vendeur2: 'Vendeur 2',
  coordonnees: 'Coordonnées',
  occupation: 'Occupation du bien',
  copropriete_questions: 'Copropriété',
  travaux: 'Travaux',
  prets: 'Prêts et hypothèques',
  plus_values: 'Plus-values',
  fiscal: 'Fiscal',
  equipements: 'Équipements',
  sinistres: 'Sinistres',
  motivation: 'Motivation de la vente',
};

function formatQValue(val) {
  if (val === true) return 'Oui';
  if (val === false) return 'Non';
  if (val === null || val === undefined || val === '') return null;
  return String(val);
}

function QuestionnairePage({ data, coproName, lotNumber }) {
  const q = data.questionnaire_data;
  if (!q || typeof q !== 'object') return null;

  // Check if questionnaire has any meaningful data
  const hasData = Object.entries(q).some(([key, section]) => {
    if (key === 'observations') return !!section;
    if (!section || typeof section !== 'object') return false;
    return Object.values(section).some(
      (v) => v !== null && v !== undefined && v !== '' && v !== false
    );
  });

  if (!hasData) return null;

  // Render non-empty sections
  const sections = [];
  for (const [sectionKey, sectionData] of Object.entries(q)) {
    if (sectionKey === 'observations') continue;
    if (!sectionData || typeof sectionData !== 'object') continue;

    const rows = [];
    for (const [fieldKey, fieldValue] of Object.entries(sectionData)) {
      const display = formatQValue(fieldValue);
      if (display === null) continue;
      rows.push({ label: QUESTIONNAIRE_LABELS[fieldKey] || fieldKey, value: display });
    }

    if (rows.length > 0) {
      sections.push({
        title: SECTION_LABELS[sectionKey] || sectionKey,
        rows,
      });
    }
  }

  return (
    <Page size="A4" style={styles.page}>
      <PartTitle>ANNEXE : QUESTIONNAIRE VENDEUR</PartTitle>

      <Spacer />

      <Text style={styles.textSmall}>
        Informations complémentaires fournies par le vendeur à destination du notaire.
      </Text>

      <Spacer />

      {sections.map((section, si) => (
        <View key={si} wrap={false} style={{ marginBottom: 8 }}>
          <SubSection>{section.title}</SubSection>
          {section.rows.map((row, ri) => (
            <DataRow
              key={ri}
              label={row.label}
              value={row.value}
              alternate={ri % 2 === 1}
            />
          ))}
        </View>
      ))}

      {!!q.observations && (
        <View style={{ marginTop: 8 }}>
          <SubSection>Observations</SubSection>
          <Text style={[styles.textSmall, { paddingHorizontal: 8, paddingVertical: 4 }]}>
            {q.observations}
          </Text>
        </View>
      )}

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── PAGE: CLAUSE DE RESPONSABILITE ─────────────────────────

function DisclaimerPage({ data, coproName, lotNumber }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  const expiresAt = data.expires_at
    ? formatDate(data.expires_at)
    : '-';

  return (
    <Page size="A4" style={styles.page}>
      <PartTitle>CLAUSE DE RESPONSABILITÉ</PartTitle>

      <Spacer />

      <Text style={styles.textLegalParagraph}>
        Le présent document est établi sur la base des déclarations du vendeur et des documents
        fournis. Il ne se substitue pas à l'état daté prévu par l'article 5 du décret du 17 mars
        1967, qui sera établi par le syndic de copropriété au moment de la mutation.
      </Text>

      <Text style={styles.textLegalParagraph}>
        Le vendeur certifie que les informations fournies sont exactes et complètes à sa
        connaissance à la date d'établissement du présent document. Toute omission ou inexactitude
        est susceptible d'engager sa responsabilité.
      </Text>

      <Text style={styles.textLegalParagraph}>
        Ce document a été généré automatiquement par Pack Vendeur avec l'assistance d'une
        intelligence artificielle. Les données extraites ont été soumises à la validation du
        vendeur avant génération.
      </Text>

      <Text style={styles.textLegalParagraph}>
        Conformément au RGPD, les données personnelles contenues dans ce document seront
        automatiquement supprimées 7 jours après sa création. Date d'expiration : {expiresAt}.
      </Text>

      <View style={styles.spacerLarge} />

      {/* Signature area */}
      <View style={styles.signatureBlock}>
        <Text style={styles.signatureLabel}>
          Fait à __________, le {today}
        </Text>

        <View style={styles.spacerLarge} />

        <Text style={styles.signatureLabel}>
          Le vendeur : {data.seller_name || '____________________________'}
        </Text>

        <View style={{ height: 8 }} />

        <Text style={styles.signatureLabel}>Signature :</Text>

        <View style={styles.signatureLine} />
      </View>

      <PageFooter coproName={coproName} lotNumber={lotNumber} />
    </Page>
  );
}

// ─── MAIN DOCUMENT ───────────────────────────────────────────

export default function PreEtatDateDocument({ data }) {
  // Normalize extracted_data if it's an array (Gemini edge case)
  const rawData = { ...data };
  if (Array.isArray(rawData.extracted_data)) {
    rawData.extracted_data = rawData.extracted_data[0] || {};
  }
  if (!rawData.extracted_data) {
    rawData.extracted_data = {};
  }

  // Common values used across pages
  const coproName = pick(
    rawData.copropriete_name,
    rawData.copropriete?.nom,
    rawData.extracted_data?.copropriete?.nom,
    'Copropriété'
  );
  const lotNumber = pick(
    rawData.property_lot_number,
    rawData.lot?.numero,
    rawData.extracted_data?.lot?.numero,
    '-'
  );

  return (
    <Document
      title={`Pré-État Daté - ${coproName} - Lot ${lotNumber}`}
      author="Pack Vendeur"
      subject={`Pré-état daté - ${coproName} - Lot ${lotNumber}`}
      language="fr"
    >
      <CoverPage data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <FinancialPages data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <CoproLifePages data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <TechnicalPages data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <ProceduresPage data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <AnnexePage data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <QuestionnairePage data={rawData} coproName={coproName} lotNumber={lotNumber} />
      <DisclaimerPage data={rawData} coproName={coproName} lotNumber={lotNumber} />
    </Document>
  );
}
