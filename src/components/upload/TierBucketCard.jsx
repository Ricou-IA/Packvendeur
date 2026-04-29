import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ChevronDown, Upload, CheckCircle2 } from 'lucide-react';
import UploadedFileRow from './UploadedFileRow';
import { cn } from '@lib/utils';

/**
 * "Soft" card used by Tier 2 (Pack notaire) and Tier 3 (Sécuriser l'acte).
 * Single dropzone + auto-classified file list. No per-type slots — the
 * promise is "drop them, we organise + rename for you", not a checklist.
 *
 * Tier 1 keeps its strict per-slot UI via DocumentItem; this card is the
 * inverse paradigm.
 *
 * Children are rendered below the file list — used for tier-specific
 * accents: chips of suggested types (Tier 3) or detected-type recap (Tier 2).
 */
export default function TierBucketCard({
  Icon,
  title,
  subtitle,
  hint,
  receivedDocs = [],
  onUpload,
  onRemove,
  done = false,
  collapsible = true,
  defaultOpen = false,
  dropzoneLabel = 'Glissez vos PDF ici',
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasAutoOpened, setHasAutoOpened] = useState(defaultOpen);

  // Auto-open once when defaultOpen flips true (e.g. user just dropped
  // matching docs and the parent recomputes defaultOpen).
  useEffect(() => {
    if (defaultOpen && !hasAutoOpened) {
      setIsOpen(true);
      setHasAutoOpened(true);
    }
  }, [defaultOpen, hasAutoOpened]);

  // Drop ANY type — backend classifier sorts per type, parent re-routes
  // each doc into the correct tier based on document_type.
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (onUpload) onUpload(files, null);
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  return (
    <section
      className={cn(
        'rounded-xl border overflow-hidden transition-colors',
        done
          ? 'border-green-300 bg-green-50/40'
          : 'border-primary-100 bg-primary-50/25',
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
                done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary-100/60 text-primary-700',
              )}
            >
              {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-secondary-900 truncate">
              {title}
            </h3>
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
        <div className="px-5 pb-5 space-y-3 animate-in fade-in-50 duration-200">
          {hint && (
            <p className="text-xs text-secondary-600 leading-relaxed">{hint}</p>
          )}

          {/* Inline dropzone — single entry, soft styling */}
          <div
            {...getRootProps()}
            className={cn(
              'border border-dashed rounded-lg px-4 py-5 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-primary-200/70 bg-white/70 hover:border-primary-400 hover:bg-white',
            )}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center gap-2 text-secondary-600">
              <Upload className="h-4 w-4" />
              <span className="text-sm">
                {isDragActive ? 'Déposez ici' : dropzoneLabel}
              </span>
            </div>
          </div>

          {/* Received docs — auto-classified, with rename animation */}
          {receivedDocs.length > 0 && (
            <div className="space-y-1.5">
              {receivedDocs.map((doc) => (
                <UploadedFileRow key={doc.id} doc={doc} onRemove={onRemove} />
              ))}
            </div>
          )}

          {/* Tier-specific accents (chips for Tier 3, recap for Tier 2) */}
          {children}
        </div>
      )}
    </section>
  );
}
