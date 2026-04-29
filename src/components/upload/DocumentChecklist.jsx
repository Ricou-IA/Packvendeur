import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/ui/collapsible';
import {
  ChevronDown,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import UploadedFileRow from './UploadedFileRow';

/**
 * Mini dropzone per document item — compact, inline.
 */
function ItemDropzone({ onDrop, multiple }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (onDrop) onDrop(acceptedFiles);
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: multiple !== false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer transition-all',
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center gap-2">
        <Upload className="h-4 w-4 text-secondary-400" />
        <p className="text-sm text-secondary-500">
          {isDragActive
            ? 'Déposez ici...'
            : 'Glissez votre PDF ou cliquez'}
        </p>
      </div>
    </div>
  );
}

/**
 * A single document item row in the checklist.
 * Exported so parent components can render items individually
 * (used by GuidedUpload Tier 1 zone).
 *
 * Désormalisé : pas de badge "Obligatoire/Facultatif" (la position dans
 * Tier 1 le dit déjà). Pas de "slot" verbal. Hint court.
 */
export function DocumentItem({ item, docs, onUpload, onRemove, isUploading }) {
  const hasDocs = docs && docs.length > 0;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (onUpload) onUpload(acceptedFiles, item.id);
    },
    [onUpload, item.id]
  );

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-colors',
      hasDocs ? 'bg-green-50/40 border-green-200' : 'bg-white border-secondary-200'
    )}>
      {/* Header — pas de badge, juste icône + label + hint */}
      <div className="flex items-start gap-2.5 min-w-0 mb-1">
        {hasDocs ? (
          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-secondary-300 mt-0.5 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-secondary-900">
            {item.label}
          </p>
          {item.hint && (
            <p className="text-xs text-secondary-500 mt-0.5">{item.hint}</p>
          )}
        </div>
      </div>

      {/* Uploaded files — UploadedFileRow gère l'animation rename "wahou" */}
      {hasDocs && (
        <div className="mt-2 space-y-1">
          {docs.map((doc) => (
            <UploadedFileRow key={doc.id} doc={doc} onRemove={onRemove} />
          ))}
        </div>
      )}

      {/* Dropzone — show if no docs, or if item accepts multiple */}
      {(!hasDocs || item.multiple) && (
        <div className="mt-2">
          <ItemDropzone
            onDrop={handleDrop}
            isUploading={isUploading}
            multiple={item.multiple}
          />
        </div>
      )}
    </div>
  );
}

/**
 * DocumentChecklist renders a collapsible group of required/optional documents.
 * Each document has its own upload slot.
 */
export default function DocumentChecklist({
  group,
  items,
  documentsByItem,
  allDocuments,
  onUpload,
  onRemove,
  isUploading,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const filledCount = items.filter(
    (item) => documentsByItem[item.id]?.length > 0
  ).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg border overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary-50 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold',
                  filledCount === items.length
                    ? 'bg-green-100 text-green-700'
                    : filledCount > 0
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-secondary-100 text-secondary-500'
                )}
              >
                {filledCount === items.length ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  group.step
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {group.title}
                </p>
                <p className="text-xs text-secondary-500">
                  {filledCount}/{items.length} document(s) fourni(s)
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-secondary-400 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {items.map((item) => (
              <DocumentItem
                key={item.id}
                item={item}
                docs={documentsByItem[item.id] || []}
                onUpload={onUpload}
                onRemove={onRemove}
                isUploading={isUploading}
              />
            ))}

          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
