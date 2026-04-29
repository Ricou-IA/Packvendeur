import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { cn } from '@lib/utils';

/**
 * Primitives UI partagées pour le questionnaire et l'upload.
 * Toutes les sections rendent à poids visuel égal ; la hiérarchie
 * vient de l'ordre, du subtitle, et de l'état (collapsed / open / done).
 */

// ---------------------------------------------------------------------------
// SectionCard — carte de section neutre, distinction essential/optional via état
// ---------------------------------------------------------------------------

export function SectionCard({
  tier = 'essential', // accepted but no longer changes visual weight
  Icon,
  title,
  subtitle,
  badge,
  done,
  collapsible = false,
  defaultOpen = true,
  hint,
  children,
  className,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasAutoOpened, setHasAutoOpened] = useState(defaultOpen);

  // Auto-open once when defaultOpen flips true (e.g. content arrives async).
  // Respect user toggle afterwards.
  useEffect(() => {
    if (defaultOpen && !hasAutoOpened) {
      setIsOpen(true);
      setHasAutoOpened(true);
    }
  }, [defaultOpen, hasAutoOpened]);

  return (
    <section
      className={cn(
        'rounded-xl border border-secondary-200 bg-white transition-colors overflow-hidden',
        done && 'border-green-300 bg-green-50/40',
        className,
      )}
    >
      <header
        className={cn(
          'flex items-center justify-between gap-3 px-5 py-4',
          collapsible && 'cursor-pointer select-none',
        )}
        onClick={collapsible ? () => setIsOpen((v) => !v) : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className={cn(
                'flex items-center justify-center h-9 w-9 rounded-lg shrink-0 transition-colors',
                'bg-secondary-100 text-secondary-600',
                done && 'bg-green-100 text-green-700',
              )}
            >
              {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-secondary-900 truncate">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-secondary-500 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {collapsible && (
          <ChevronDown
            className={cn(
              'h-4 w-4 text-secondary-400 shrink-0 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </header>

      {(!collapsible || isOpen) && (
        <div className="px-5 pb-5 space-y-4 animate-in fade-in-50 duration-200">
          {hint && <HintCard>{hint}</HintCard>}
          {children}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// BonusDivider — sépare les sections essentielles du Pack Vendeur "offert".
// Marketing : signal explicite "c'est gratuit, ça enrichit votre dossier".
// ---------------------------------------------------------------------------

export function BonusDivider({ subtitle, className }) {
  return (
    <div className={cn('pt-4', className)}>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-secondary-200" />
        <div className="flex items-center gap-2 text-secondary-700">
          <Gift className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold">Pack Vendeur</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-green-100 text-green-700 ring-1 ring-green-200">
            Offert
          </span>
        </div>
        <div className="flex-1 h-px bg-secondary-200" />
      </div>
      {subtitle && (
        <p className="text-center text-xs text-secondary-500 max-w-xl mx-auto mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HintCard — encadré "info / valeur ajoutée"
// ---------------------------------------------------------------------------

export function HintCard({ children, icon: IconProp = Lightbulb, className }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg bg-primary-50/40 border border-primary-100/80 px-3 py-2.5 text-sm text-secondary-700',
        className,
      )}
    >
      <IconProp className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressIndicator — barre de progression sticky, single bar
// ---------------------------------------------------------------------------

export function ProgressIndicator({
  essentialDone,
  essentialTotal,
  optionalDone,
  optionalTotal,
  className,
}) {
  const essentialPct = essentialTotal === 0 ? 0 : Math.round((essentialDone / essentialTotal) * 100);
  const allEssentialDone = essentialDone === essentialTotal && essentialTotal > 0;
  const showOptional = optionalTotal > 0;

  return (
    <div
      className={cn(
        'sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-secondary-200/80',
        className,
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-colors shrink-0',
            allEssentialDone
              ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
              : 'bg-primary-100 text-primary-700',
          )}
        >
          {allEssentialDone ? <CheckCircle2 className="h-4 w-4" /> : `${essentialDone}/${essentialTotal}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold text-secondary-700">
              {allEssentialDone ? 'Indispensable complet' : 'Indispensable'}
            </p>
            {showOptional && (
              <p className="text-xs text-secondary-400">
                {optionalDone}/{optionalTotal} optionnels
              </p>
            )}
          </div>
          <div className="h-1 w-full bg-secondary-100 rounded-full overflow-hidden mt-1">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                allEssentialDone ? 'bg-green-500' : 'bg-primary-500',
              )}
              style={{ width: `${essentialPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
