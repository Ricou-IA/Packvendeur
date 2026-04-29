import { useEffect, useState } from 'react';
import { FileText, Loader2, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

const RENAME_ANIM_MS = 2400;

/**
 * One uploaded file, displayed in the receivedDocs list of any tier.
 * Animates the "rename" moment when classification finishes:
 *   original_filename (struck-through, fades) → normalized_filename (slides in, sparkle)
 * After ~2.4 s the original is dropped and only the normalized name remains.
 *
 * Intentionally honest: when mounted on a doc that is *already* classified
 * (e.g. user comes back to the page), no animation plays — we don't fake
 * work that already happened.
 */
export default function UploadedFileRow({ doc, onRemove }) {
  const initiallyClassified = !!doc?.normalized_filename;
  const [phase, setPhase] = useState(initiallyClassified ? 'classified' : 'classifying');

  useEffect(() => {
    if (phase === 'classifying' && doc?.normalized_filename) {
      setPhase('renaming');
      const t = setTimeout(() => setPhase('classified'), RENAME_ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [phase, doc?.normalized_filename]);

  const isClassifying = phase === 'classifying';
  const isRenaming = phase === 'renaming';

  return (
    <div className="flex items-center justify-between rounded-md bg-white border border-secondary-200/80 px-3 py-2 gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <FileText className="h-4 w-4 text-secondary-400 flex-shrink-0" />

        {isRenaming ? (
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className="text-[11px] text-secondary-400 line-through truncate animate-in fade-in-50 duration-300"
              key={`old-${doc.id}`}
            >
              {doc.original_filename}
            </span>
            <span
              className="text-xs font-medium text-green-700 truncate animate-in fade-in-50 slide-in-from-bottom-1 duration-500"
              key={`new-${doc.id}`}
            >
              {doc.normalized_filename}
            </span>
          </div>
        ) : (
          <span
            className={cn(
              'text-xs truncate',
              isClassifying ? 'text-secondary-700' : 'text-secondary-800 font-medium',
            )}
          >
            {isClassifying ? doc.original_filename : doc.normalized_filename}
          </span>
        )}

        {!isRenaming && (
          <span className="text-[11px] text-secondary-400 flex-shrink-0">
            {formatFileSize(doc.file_size_bytes)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {isClassifying && (
          <Loader2 className="h-3.5 w-3.5 text-secondary-400 animate-spin" />
        )}
        {isRenaming && (
          <Sparkles
            className="h-3.5 w-3.5 text-amber-500 animate-pulse"
            aria-label="Reconnu et renommé"
          />
        )}
        {phase === 'classified' && (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-secondary-400 hover:text-destructive"
          onClick={() => onRemove(doc.id, doc.storage_path)}
          aria-label="Retirer le document"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
