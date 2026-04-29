import { useEffect, useState } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useAnalysis } from '@hooks/useAnalysis';
import { useDossier } from '@hooks/useDossier';
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const POLL_INTERVAL_MS = 3000;
const TICK_INTERVAL_MS = 1000;
const STUCK_THRESHOLD_MS = 90_000;
const TYPICAL_DURATION_HINT = '30 secondes à 1 minute 30';

function formatElapsed(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Asymptotic progress: rises fast then plateaus around 85%. Never reaches
// 100% before the real `pending_validation` signal — we don't lie about
// being almost done when we're not.
//   t=15s → 38%  · t=30s → 62%  · t=45s → 76%  · t=60s → 83%  · t→∞ → 85%
function asymptoticProgress(elapsedMs) {
  return Math.round(85 * (1 - Math.exp(-elapsedMs / 25_000)));
}

/**
 * Step 4 (Pay-first funnel): post-payment processing page.
 *
 * Auto-triggers `pv-run-extraction` (server orchestrator) on mount when the
 * dossier is paid + not yet extracted. The actual work runs server-side via
 * EdgeRuntime.waitUntil — closing the tab does not lose results.
 *
 * UI is intentionally honest: no fake step-by-step checklist tied to
 * hardcoded durations. Just a real elapsed-time counter, an asymptotic
 * progress bar that plateaus at 85% (only jumps to 100% on the real done
 * signal), and a stuck-state retry past 90 s.
 */
export default function ProcessingStep({ dossierId, dossier, onComplete }) {
  const { refresh: refreshDossier } = useDossier();
  const { isAnalyzing, progress, startAnalysis, resetForRetry } = useAnalysis(dossierId);

  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(Date.now());

  const status = dossier?.status;
  const isRunning = status === 'paid' || status === 'analyzing';
  const isDone =
    status === 'pending_validation' ||
    status === 'validated' ||
    status === 'completed';
  const isTriggerError = progress.phase === 'error';

  // Anchor the elapsed timer when entering the running phase.
  // - Fresh mount during 'analyzing' (e.g. user refreshed): use updated_at so
  //   the timer reflects the real server start.
  // - Otherwise: anchor to mount time.
  useEffect(() => {
    if (!isRunning || startTime !== null) return;
    if (status === 'analyzing' && dossier?.updated_at) {
      const ts = new Date(dossier.updated_at).getTime();
      setStartTime(Number.isFinite(ts) ? ts : Date.now());
    } else {
      setStartTime(Date.now());
    }
  }, [isRunning, status, dossier?.updated_at, startTime]);

  // Poll the dossier while running — orchestration runs in the Edge Function
  // and there's no live websocket, we have to pull status ourselves.
  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(refreshDossier, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [isRunning, refreshDossier]);

  // Tick the wall clock for the elapsed counter
  useEffect(() => {
    if (!isRunning || isDone || isTriggerError) return;
    const t = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
    return () => clearInterval(t);
  }, [isRunning, isDone, isTriggerError]);

  // Auto-trigger the orchestrator on mount if the dossier is paid and
  // not yet extracted. Idempotent — the EF checks state itself before running.
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
      status !== 'analyzing' &&
      status !== 'pending_validation' &&
      status !== 'validated' &&
      status !== 'completed' &&
      !hasRealExtraction;

    if (canTrigger) {
      startAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing, progress.phase, dossier?.stripe_payment_status, status]);

  // Auto-advance to Step 5 once extraction is done
  useEffect(() => {
    if (isDone && onComplete) {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [isDone, onComplete]);

  const elapsedMs = startTime !== null ? now - startTime : 0;
  const isStuck = isRunning && elapsedMs > STUCK_THRESHOLD_MS;
  const progressPct = isDone ? 100 : asymptoticProgress(elapsedMs);

  const handleRetry = async () => {
    await resetForRetry();
    setStartTime(null);
    setNow(Date.now());
  };

  // ── Render ─────────────────────────────────────────────────────────────

  if (isTriggerError) {
    return (
      <div className="space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Un instant…</h2>
          <p className="text-secondary-500 text-sm">Un petit souci technique, rien de grave.</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                Notre service d'analyse est momentanément indisponible. Cela arrive
                parfois lors de pics et se résout en quelques instants.{' '}
                <strong>Votre paiement est enregistré</strong>, aucun risque de double facturation.
              </p>
            </div>
            <Button onClick={handleRetry} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Relancer l'analyse
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header — state-aware, calm */}
      <div className="text-center mb-2">
        {isDone ? (
          <>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Analyse terminée</h2>
            <p className="text-secondary-500 text-sm">Redirection vers la validation…</p>
          </>
        ) : isStuck ? (
          <>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
              L'analyse est plus longue que d'habitude
            </h2>
            <p className="text-secondary-500 text-sm">
              Pas d'inquiétude — votre paiement est enregistré et l'analyse continue.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
              Analyse de vos documents
            </h2>
            <p className="text-secondary-500 text-sm">
              Nous extrayons les données pour votre pré-état daté.
            </p>
          </>
        )}
      </div>

      {/* Main card — spinner + elapsed + asymptotic progress bar */}
      <Card>
        <CardContent className="pt-8 pb-7 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 flex items-center justify-center">
              {isDone ? (
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              ) : (
                <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
              )}
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-semibold text-secondary-900 tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatElapsed(elapsedMs)}
              </div>
              <div className="text-xs text-secondary-500 mt-1">
                {isDone ? 'Terminé' : `Durée typique : ${TYPICAL_DURATION_HINT}`}
              </div>
            </div>
          </div>

          <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isDone
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {isStuck && !isDone && (
            <div className="border-t border-secondary-100 pt-5">
              <p className="text-sm text-secondary-600 text-center mb-3">
                Si vous préférez, vous pouvez relancer l'analyse maintenant.
              </p>
              <Button onClick={handleRetry} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Relancer l'analyse
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reassurance — visible, not buried in grey-400 */}
      {!isDone && (
        <div className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-lg p-4">
          <ShieldCheck className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-primary-900 leading-relaxed">
            <strong>Vous pouvez fermer cette page sans risque.</strong> L'analyse
            continue sur nos serveurs et votre paiement est enregistré. Revenez sur
            ce lien plus tard pour récupérer votre dossier.
          </div>
        </div>
      )}
    </div>
  );
}
