import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/ui/collapsible';
import {
  ChevronDown,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Mini dropzone per document item — compact, inline.
 */
function ItemDropzone({ onDrop, isUploading, multiple }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (onDrop) onDrop(acceptedFiles);
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: multiple !== false,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer transition-all',
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400',
        isUploading && 'opacity-50 cursor-not-allowed'
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
 */
function DocumentItem({ item, docs, onUpload, onRemove, isUploading }) {
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
      hasDocs ? 'bg-green-50/50 border-green-200' : 'bg-white border-secondary-200'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-start gap-2 min-w-0">
          {hasDocs ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          ) : item.required ? (
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
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
        <div className="flex-shrink-0">
          {item.required ? (
            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
              Obligatoire
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-secondary-400">
              Facultatif
            </Badge>
          )}
        </div>
      </div>

      {/* Uploaded files */}
      {hasDocs && (
        <div className="mt-2 space-y-1">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-md bg-white border px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 text-secondary-400 flex-shrink-0" />
                <span className="text-xs text-secondary-700 truncate">
                  {doc.original_filename}
                </span>
                <span className="text-xs text-secondary-400 flex-shrink-0">
                  {formatFileSize(doc.file_size_bytes)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {doc.document_type ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <Loader2 className="h-3 w-3 text-secondary-400 animate-spin" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-secondary-400 hover:text-destructive"
                  onClick={() => onRemove(doc.id, doc.storage_path)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
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
