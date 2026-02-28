import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Input } from '@components/ui/input';
import {
  FileText, Download, Share2, Copy, CheckCircle,
  Clock, Loader2, FilePlus2,
} from 'lucide-react';
import { toast } from '@components/ui/sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { documentService } from '@services/document.service';
import { dossierService } from '@services/dossier.service';
import { pdfService } from '@services/pdf.service';
import PreEtatDateDocument from '@components/pdf/PreEtatDateTemplate';
import { dossierKeys } from '@hooks/useDossier';

export default function DeliveryPanel({ dossier, documents, onResetSession }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfPath, setPdfPath] = useState(dossier?.pre_etat_date_pdf_path || null);
  const [shareUrl, setShareUrl] = useState(dossier?.share_url || '');
  const didRun = useRef(false);

  // Auto-generate PDF + share link on mount
  useEffect(() => {
    if (didRun.current || !dossier?.id) return;
    didRun.current = true;

    const generate = async () => {
      setIsGenerating(true);

      try {
        // 1. Generate share link if not already done
        if (!dossier.share_token) {
          const { data: updated } = await dossierService.generateShareLink(dossier.id);
          if (updated?.share_url) {
            setShareUrl(updated.share_url);
          }
        }

        // 2. Generate PDF if not already done
        if (!dossier.pre_etat_date_pdf_path) {
          // Normalize extracted_data (handle array from Gemini)
          const extracted = Array.isArray(dossier.extracted_data)
            ? dossier.extracted_data[0]
            : (dossier.extracted_data || {});

          // Build data for PDF template.
          // Priority: flat dossier columns (user-validated) > extracted_data nested objects.
          // This ensures user corrections in Step 3 are NEVER overridden by AI extraction.
          const pdfData = {
            ...dossier,
            extracted_data: extracted,

            // Nested structures: start from extracted then override with flat validated columns
            copropriete: {
              ...(extracted.copropriete || {}),
              nom: dossier.copropriete_name ?? extracted?.copropriete?.nom,
              adresse: dossier.property_address ?? extracted?.copropriete?.adresse,
              syndic_nom: dossier.syndic_name ?? extracted?.copropriete?.syndic_nom,
              syndic_type: dossier.syndic_type ?? extracted?.copropriete?.syndic_type,
              syndic_mandat_fin: dossier.syndic_mandat_fin ?? extracted?.copropriete?.syndic_mandat_fin,
              tantiemes_totaux: dossier.tantiemes_totaux ?? extracted?.copropriete?.tantiemes_totaux,
              nombre_lots: dossier.nombre_lots_copropriete ?? extracted?.copropriete?.nombre_lots,
              assurance_multirisque: dossier.assurance_multirisque ?? extracted?.copropriete?.assurance_multirisque,
              assurance_numero_contrat: dossier.assurance_numero_contrat ?? extracted?.copropriete?.assurance_numero_contrat,
              prochaine_ag_date: dossier.prochaine_ag_date ?? extracted?.copropriete?.prochaine_ag_date,
              copropriete_en_difficulte: dossier.copropriete_en_difficulte ?? extracted?.copropriete?.copropriete_en_difficulte,
              copropriete_difficulte_details: dossier.copropriete_difficulte_details ?? extracted?.copropriete?.copropriete_difficulte_details,
              fibre_optique: dossier.fibre_optique ?? extracted?.copropriete?.fibre_optique,
              date_construction: dossier.date_construction ?? extracted?.copropriete?.date_construction,
            },
            lot: {
              ...(extracted.lot || {}),
              numero: dossier.property_lot_number ?? extracted?.lot?.numero,
              surface_carrez: dossier.property_surface ?? extracted?.lot?.surface_carrez,
              tantiemes_generaux: dossier.tantiemes_lot ?? extracted?.lot?.tantiemes_generaux,
            },
            financier: {
              ...(extracted.financier || {}),
              budget_previsionnel_annuel: dossier.budget_previsionnel ?? extracted?.financier?.budget_previsionnel_annuel,
              charges_courantes_lot: dossier.charges_courantes ?? extracted?.financier?.charges_courantes_lot,
              charges_exceptionnelles_lot: dossier.charges_exceptionnelles ?? extracted?.financier?.charges_exceptionnelles_lot,
              fonds_travaux_solde: dossier.fonds_travaux_balance ?? extracted?.financier?.fonds_travaux_solde,
              impayes_vendeur: dossier.impaye_vendeur ?? extracted?.financier?.impayes_vendeur,
              dette_copro_fournisseurs: dossier.dette_copro_fournisseurs ?? extracted?.financier?.dette_copro_fournisseurs,
              charges_budget_n1: dossier.charges_budget_n1 ?? extracted?.financier?.charges_budget_n1,
              charges_budget_n2: dossier.charges_budget_n2 ?? extracted?.financier?.charges_budget_n2,
              charges_hors_budget_n1: dossier.charges_hors_budget_n1 ?? extracted?.financier?.charges_hors_budget_n1,
              charges_hors_budget_n2: dossier.charges_hors_budget_n2 ?? extracted?.financier?.charges_hors_budget_n2,
              provisions_exigibles: dossier.provisions_exigibles ?? extracted?.financier?.provisions_exigibles,
              avances_reserve: dossier.avances_reserve ?? extracted?.financier?.avances_reserve,
              provisions_speciales: dossier.provisions_speciales ?? extracted?.financier?.provisions_speciales,
              emprunt_collectif_solde: dossier.emprunt_collectif_solde ?? extracted?.financier?.emprunt_collectif_solde,
              emprunt_collectif_echeance: dossier.emprunt_collectif_echeance ?? extracted?.financier?.emprunt_collectif_echeance,
              cautionnement_solidaire: dossier.cautionnement_solidaire ?? extracted?.financier?.cautionnement_solidaire,
              fonds_travaux_cotisation_annuelle: dossier.fonds_travaux_cotisation ?? extracted?.financier?.fonds_travaux_cotisation_annuelle,
              fonds_travaux_exists: dossier.fonds_travaux_exists ?? extracted?.financier?.fonds_travaux_exists,
              impaye_charges_global: dossier.impaye_charges_global ?? extracted?.financier?.impaye_charges_global,
              dette_fournisseurs_global: dossier.dette_fournisseurs_global ?? extracted?.financier?.dette_fournisseurs_global,
            },
            juridique: {
              ...(extracted.juridique || {}),
              procedures_en_cours: dossier.procedures_en_cours ?? extracted?.juridique?.procedures_en_cours,
              procedures_details: dossier.procedures_details ?? extracted?.juridique?.procedures_details,
              travaux_votes_non_realises: dossier.travaux_votes_non_realises ?? extracted?.juridique?.travaux_votes_non_realises,
              travaux_votes_details: dossier.travaux_details ?? extracted?.juridique?.travaux_votes_details,
            },
            diagnostics: {
              ...(extracted.diagnostics || {}),
              dpe_numero_ademe: dossier.dpe_ademe_number ?? extracted?.diagnostics?.dpe_numero_ademe,
              dpe_date: dossier.dpe_date ?? extracted?.diagnostics?.dpe_date,
              dpe_classe_energie: dossier.dpe_classe_energie ?? extracted?.diagnostics?.dpe_classe_energie,
              dpe_classe_ges: dossier.dpe_classe_ges ?? extracted?.diagnostics?.dpe_classe_ges,
              dtg_date: dossier.dtg_date ?? extracted?.diagnostics?.dtg_date,
              dtg_resultat: dossier.dtg_resultat ?? extracted?.diagnostics?.dtg_resultat,
              plan_pluriannuel_exists: dossier.plan_pluriannuel_exists ?? extracted?.diagnostics?.plan_pluriannuel_exists,
              plan_pluriannuel_details: dossier.plan_pluriannuel_details ?? extracted?.diagnostics?.plan_pluriannuel_details,
              amiante_dta_date: dossier.amiante_dta_date ?? extracted?.diagnostics?.amiante_dta_date,
              plomb_date: dossier.plomb_date ?? extracted?.diagnostics?.plomb_date,
              termites_date: dossier.termites_date ?? extracted?.diagnostics?.termites_date,
              audit_energetique_date: dossier.audit_energetique_date ?? extracted?.diagnostics?.audit_energetique_date,
              ascenseur_exists: dossier.ascenseur_exists ?? extracted?.diagnostics?.ascenseur_exists,
              ascenseur_rapport_date: dossier.ascenseur_rapport_date ?? extracted?.diagnostics?.ascenseur_rapport_date,
              piscine_exists: dossier.piscine_exists ?? extracted?.diagnostics?.piscine_exists,
              recharge_vehicules: dossier.recharge_vehicules ?? extracted?.diagnostics?.recharge_vehicules,
            },
            // Questionnaire and documents list for PDF
            questionnaire_data: dossier.questionnaire_data || {},
            documentsTransmis: documents || [],
          };

          const { data: storagePath, error: pdfError } =
            await pdfService.generateAndUpload(dossier.id, pdfData, PreEtatDateDocument);

          if (pdfError) throw pdfError;

          // Save PDF path to dossier
          await dossierService.updateDossier(dossier.id, {
            pre_etat_date_pdf_path: storagePath,
            status: 'completed',
          });

          setPdfPath(storagePath);
          toast.success('PDF généré avec succès');
        } else {
          setPdfPath(dossier.pre_etat_date_pdf_path);
        }

        // Refresh dossier in cache
        queryClient.invalidateQueries({ queryKey: dossierKeys.all });
      } catch (error) {
        console.error('[DeliveryPanel] Generation error:', error);
        toast.error('Erreur lors de la génération du PDF');
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [dossier, queryClient]);

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Lien copié');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!pdfPath) {
      toast.error('PDF en cours de génération...');
      return;
    }
    const { data: url } = await documentService.getSignedUrl(pdfPath);
    if (url) window.open(url, '_blank');
  };

  // Loading state while generating
  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Génération en cours...
          </h2>
          <p className="text-secondary-500">
            Préparation de votre pré-état daté et du lien de partage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Votre pack est prêt
        </h2>
        <p className="text-secondary-500">
          Téléchargez vos documents ou partagez le lien avec votre notaire.
        </p>
      </div>

      {/* Lien de partage */}
      <Card className="border-primary-200 bg-primary-50/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary-600" />
            Lien de partage notaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="bg-white" />
            <Button onClick={copyShareLink} variant="outline" className="gap-2 whitespace-nowrap">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>
          <p className="text-xs text-secondary-500">
            Ce lien permet au notaire de télécharger tous les documents du pack.
          </p>
        </CardContent>
      </Card>

      {/* Téléchargements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Téléchargements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleDownloadPdf} className="w-full justify-start gap-3" variant="outline">
            <FileText className="h-5 w-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium">Pré-état daté</p>
              <p className="text-xs text-secondary-500">Synthèse financière et juridique PDF</p>
            </div>
            <Download className="h-4 w-4 ml-auto" />
          </Button>

          {documents.filter((d) => d.document_type && d.document_type !== 'other').length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium text-secondary-700 mb-2">
                Documents classés ({documents.length})
              </p>
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm text-secondary-600 py-1">
                    <FileText className="h-3 w-3 text-secondary-400" />
                    <span className="truncate">{doc.normalized_filename || doc.original_filename}</span>
                    <Badge variant="secondary" className="text-[10px] ml-auto">
                      {doc.document_type?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RGPD */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Vos documents seront automatiquement supprimés le{' '}
          {dossier?.expires_at && format(new Date(dossier.expires_at), 'dd MMMM yyyy', { locale: fr })}
          {' '}conformément au RGPD. Téléchargez-les avant cette date.
        </AlertDescription>
      </Alert>

      {/* Nouveau dossier */}
      {onResetSession && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={onResetSession} className="gap-2">
            <FilePlus2 className="h-4 w-4" />
            Créer un nouveau dossier
          </Button>
        </div>
      )}
    </div>
  );
}
