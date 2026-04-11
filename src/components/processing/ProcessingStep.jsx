import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useAnalysis } from '@hooks/useAnalysis';
import { useDossier } from '@hooks/useDossier';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileCheck,
  FileSearch,
  Euro,
  Scale,
  Hammer,
  FileText,
} from 'lucide-react';

/**
 * Visible sub-steps shown as a vertical checklist to keep the user engaged
 * during the 30-60s extraction. Durations are approximate — the real work
 * happens in parallel server-side; this is purely a visual progress hint.
 */
const SUB_STEPS = [
  { key: 'received',   icon: FileCheck,  label: 'Documents réceptionnés',                duration: 0 },
  { key: 'diagnostics',icon: FileSearch, label: 'Analyse des diagnostics techniques',    duration: 6000 },
  { key: 'financial',  icon: Euro,       label: 'Extraction des données financières',    duration: 12000 },
  { key: 'tantiemes',  icon: Scale,      label: 'Vérification des tantièmes et charges', duration: 8000 },
  { key: 'travaux',    icon: Hammer,     label: 'Détection des travaux et procédures',   duration: 8000 },
  { key: 'generation', icon: FileText,   label: 'Préparation du pré-état daté',          duration: 6000 },
];

// Cumulative timing from extraction start for each sub-step boundary.
// e.g. after 6s → past 'diagnostics', after 18s → past 'financial', ...
const CUMULATIVE = SUB_STEPS.reduce((acc, step, i) => {
  acc.push((acc[i - 1] || 0) + step.duration);
  return acc;
}, []);

/**
 * Given elapsed ms since extraction started, return the active sub-step index.
 * Caps at the penultimate step — we only unlock the last one when the
 * backend actually returns pending_validation.
 */
function indexFromElapsed(elapsedMs) {
  for (let i = 0; i < CUMULATIVE.length; i++) {
    if (elapsedMs < CUMULATIVE[i]) return i;
  }
  return Math.max(1, SUB_STEPS.length - 1);
}

/**
 * Step 4 (Pay-first funnel): post-payment processing page.
 *
 * Auto-triggers the full AI extraction (financial + diagnostics via
 * useAnalysis) on mount. Advances the wizard to Step 5 (Validation)
 * when status flips to 'pending_validation'.
 *
 * Idempotent: if the user closes the tab and comes back, detects the
 * paid-but-unextracted state and resumes automatically.
 */
export default function ProcessingStep({ dossierId, dossier, documents, onComplete }) {
  const { sessionId, refresh: refreshDossier } = useDossier();
  const { isAnalyzing, progress, startAnalysis, resetForRetry } = useAnalysis(dossierId, sessionId);

  // Visible sub-step index (0 = received, last = generation). Advances on a timer.
  const [activeIdx, setActiveIdx] = useState(0);
  const resumedFromDbRef = useRef(false);

  // Poll the dossier every 3s while extraction is in progress server-side.
  // The orchestration runs in an Edge Function via EdgeRuntime.waitUntil, so
  // we need to pull the status ourselves — there's no live websocket.
  useEffect(() => {
    const status = dossier?.status;
    const shouldPoll = status === 'paid' || status === 'analyzing';
    if (!shouldPoll) return;

    const timer = setInterval(() => {
      refreshDossier();
    }, 3000);
    return () => clearInterval(timer);
  }, [dossier?.status, refreshDossier]);

  // Auto-trigger the server-side orchestrator on mount if the dossier is paid
  // and not yet extracted.
  //
  // NOTE: extracted_data has a SQL default of '{}'::jsonb, so we can't just
  // check for truthiness — we check for actual content via Object.keys.
  //
  // We DON'T re-trigger when status === 'analyzing' because that means the
  // background task is already running server-side. Even refreshing the tab
  // now just drops back onto a running job. No more "stuck detection" needed
  // since the extraction persists independently of the client.
  useEffect(() => {
    const extracted = dossier?.extracted_data;
    const hasRealExtraction =
      extracted && typeof extracted === 'object' && !Array.isArray(extracted)
        ? Object.keys(extracted).length > 0
        : Array.isArray(extracted) && extracted.length > 0;

    const canTrigger =
      !isAnalyzing &&
      progress.phase === 'idle' &&
      dossier?.stripe_payment_status === 'paid' &&
      dossier?.status !== 'analyzing' &&
      dossier?.status !== 'pending_validation' &&
      dossier?.status !== 'validated' &&
      dossier?.status !== 'completed' &&
      !hasRealExtraction;

    if (canTrigger) {
      startAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing, progress.phase, startAnalysis, dossier?.stripe_payment_status, dossier?.status]);

  // On mount / when dossier flips to 'analyzing': if extraction already
  // started server-side (e.g. after a page refresh), resume the checklist
  // from the elapsed-time position instead of restarting from step 0.
  useEffect(() => {
    if (resumedFromDbRef.current) return;
    if (dossier?.status !== 'analyzing' || !dossier?.updated_at) return;

    const startedAt = new Date(dossier.updated_at).getTime();
    if (!Number.isFinite(startedAt)) return;

    const elapsed = Date.now() - startedAt;
    if (elapsed <= 0) return;

    const resumedIdx = indexFromElapsed(elapsed);
    if (resumedIdx > 0) {
      setActiveIdx(resumedIdx);
    }
    resumedFromDbRef.current = true;
  }, [dossier?.status, dossier?.updated_at]);

  // Advance through sub-steps on a loose timer while extraction is running.
  // Caps at the penultimate step — we only mark "generation" complete once
  // the backend actually returns pending_validation.
  useEffect(() => {
    const running = dossier?.status === 'analyzing' || isAnalyzing;

    if (!running) return;

    // First sub-step is "received" — mark it done immediately
    if (activeIdx === 0) {
      setActiveIdx(1);
      return;
    }

    // Advance to the next sub-step after its duration
    const current = SUB_STEPS[activeIdx];
    if (!current || activeIdx >= SUB_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setActiveIdx((i) => Math.min(i + 1, SUB_STEPS.length - 1));
    }, current.duration);

    return () => clearTimeout(timer);
  }, [dossier?.status, isAnalyzing, activeIdx]);

  // When extraction finishes (via hook OR via dossier status from polling),
  // snap all sub-steps to done and advance the wizard to Step 5.
  useEffect(() => {
    const done = progress.phase === 'done' || dossier?.status === 'pending_validation';
    if (done) {
      setActiveIdx(SUB_STEPS.length); // beyond last → all checked
      if (onComplete) {
        const timer = setTimeout(onComplete, 1400);
        return () => clearTimeout(timer);
      }
    }
  }, [progress.phase, dossier?.status, onComplete]);

  const handleRetry = () => {
    resetForRetry();
    setActiveIdx(0);
  };

  const isError = progress.phase === 'error';
  const isDone = progress.phase === 'done' || dossier?.status === 'pending_validation';

  // Overall progress percentage for the top bar
  const overallPct = isDone
    ? 100
    : Math.round((activeIdx / SUB_STEPS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          {isError
            ? 'Un instant…'
            : isDone
              ? 'Analyse terminée'
              : 'Analyse de vos documents en cours'}
        </h2>
        <p className="text-secondary-500">
          {isError
            ? 'Un petit souci technique, rien de grave !'
            : isDone
              ? 'Redirection vers la validation…'
              : 'Notre IA extrait les données pour votre pré-état daté. Cela prend généralement 30 à 60 secondes.'}
        </p>
      </div>

      {isError ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-medium text-secondary-900">Analyse interrompue</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Notre service d'analyse est momentanément indisponible. Cela arrive
                parfois lors de pics d'utilisation et se résout généralement en
                quelques instants. Votre paiement est bien enregistré — aucun
                risque de double facturation.
              </p>
            </div>
            <Button onClick={handleRetry} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Relancer l'analyse
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Top progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-secondary-500">
                <span>Progression</span>
                <span className="tabular-nums">{overallPct}%</span>
              </div>
              <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-700 ease-out"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            {/* Vertical checklist of sub-steps */}
            <ol className="space-y-3 pt-2">
              {SUB_STEPS.map((step, idx) => {
                const isCompleted = isDone || idx < activeIdx;
                const isActive = !isDone && idx === activeIdx;
                const isPending = !isDone && idx > activeIdx;
                const Icon = step.icon;

                return (
                  <li
                    key={step.key}
                    className={`flex items-center gap-3 py-1.5 transition-opacity duration-500 ${
                      isPending ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5 text-secondary-300" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isCompleted
                          ? 'text-secondary-700 line-through decoration-secondary-300'
                          : isActive
                            ? 'text-secondary-900 font-medium'
                            : 'text-secondary-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Reassurance note — visible while running */}
      {!isError && !isDone && (
        <div className="text-center text-xs text-secondary-400">
          <p>Votre paiement est enregistré. L'analyse continue même si vous actualisez la page.</p>
        </div>
      )}
    </div>
  );
}
