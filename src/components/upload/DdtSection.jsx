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
  Info,
} from 'lucide-react';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Reference list of diagnostic types for the coverage grid.
 * `required` here means legally mandatory for most transactions.
 */
const DIAGNOSTIC_TYPES = [
  { id: 'diagnostic_mesurage', label: 'Mesurage Carrez', required: true },
  { id: 'diagnostic_amiante', label: 'Amiante', required: true },
  { id: 'diagnostic_plomb', label: 'Plomb (CREP)', required: false },
  { id: 'diagnostic_electricite', label: 'Électricité', required: false },
  { id: 'diagnostic_gaz', label: 'Gaz', required: false },
  { id: 'diagnostic_erp', label: 'ERP', required: true },
  { id: 'diagnostic_termites', label: 'Termites', required: false },
  { id: 'dpe', label: 'DPE', required: false },
  { id: 'audit_energetique', label: 'Audit énergétique', required: false },
];

/** Short labels shown as badges on classified files. */
const TYPE_LABELS = {
  diagnostic_mesurage: 'Carrez',
  diagnostic_amiante: 'Amiante',
  diagnostic_plomb: 'Plomb',
  diagnostic_electricite: 'Électricité',
  diagnostic_gaz: 'Gaz',
  diagnostic_erp: 'ERP',
  diagnostic_termites: 'Termites',
  dpe: 'DPE',
  audit_energetique: 'Audit énergie',
};

/**
 * DdtSection — single dropzone for ALL diagnostic documents (DDT).
 *
 * Replaces the per-diagnostic-type rows from DocumentChecklist.
 * Users can drop individual diagnostic PDFs or one combined DDT.
 * After classification, a coverage grid shows which diagnostics
 * have been detected. Full verification happens at extraction time.
 */
export default function DdtSection({
  group,
  diagnosticDocuments,
  unclassifiedDocuments,
  onUpload,
  onRemove,
  isUploading,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const allDocs = [...diagnosticDocuments, ...(unclassifiedDocuments || [])];

  // Which specific diagnostic types were detected via classification.
  // For combined DDT documents, ai_classification_raw.diagnostics_couverts
  // lists ALL diagnostic types found in a single PDF.
  // Also handles legacy format where ai_classification_raw is an array of objects.
  const detectedTypes = new Set();
  for (const doc of diagnosticDocuments) {
    if (doc.document_type) detectedTypes.add(doc.document_type);

    const raw = doc.ai_classification_raw;
    if (!raw) continue;

    // New format (v9+): single object with diagnostics_couverts array
    if (!Array.isArray(raw) && Array.isArray(raw.diagnostics_couverts)) {
      for (const type of raw.diagnostics_couverts) detectedTypes.add(type);
    }
    // Legacy format (v7): array of classification objects, one per diagnostic
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (item?.document_type) detectedTypes.add(item.document_type);
      }
    }
  }

  const requiredCount = DIAGNOSTIC_TYPES.filter((d) => d.required).length;
  const requiredDetected = DIAGNOSTIC_TYPES.filter(
    (d) => d.required && detectedTypes.has(d.id)
  ).length;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      // No hintType — let the AI classifier determine the diagnostic type
      if (onUpload) onUpload(acceptedFiles, null);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    disabled: isUploading,
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg border overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary-50 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold',
                  requiredDetected === requiredCount && allDocs.length > 0
                    ? 'bg-green-100 text-green-700'
                    : allDocs.length > 0
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-secondary-100 text-secondary-500'
                )}
              >
                {requiredDetected === requiredCount && allDocs.length > 0 ? (
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
                  {allDocs.length === 0
                    ? 'Aucun document déposé'
                    : `${allDocs.length} document(s) déposé(s)`}
                  {detectedTypes.size > 0 &&
                    ` — ${detectedTypes.size} diagnostic(s) détecté(s)`}
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
            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Déposez ici vos diagnostics techniques, soit de façon séparée,
                soit en un document complet (DDT). L'IA identifiera
                automatiquement les diagnostics contenus.
              </p>
            </div>

            {/* Single dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-secondary-400" />
                <p className="text-sm text-secondary-600">
                  {isDragActive
                    ? 'Déposez vos diagnostics ici...'
                    : 'Glissez vos DDT ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs text-secondary-400">
                  PDF uniquement — plusieurs fichiers acceptés
                </p>
              </div>
            </div>

            {/* Uploaded file list */}
            {allDocs.length > 0 && (
              <div className="space-y-1">
                {allDocs.map((doc) => (
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
                        <Badge variant="outline" className="text-xs gap-1 text-green-700 border-green-300">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          Analysé
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs gap-1 text-secondary-400"
                        >
                          <Loader2 className="h-3 w-3 animate-spin" />
                          analyse...
                        </Badge>
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

            {/* Diagnostic type coverage grid */}
            {allDocs.length > 0 && (
              <div className="rounded-lg border bg-secondary-50/50 p-3">
                <p className="text-xs font-medium text-secondary-600 mb-2">
                  Diagnostics détectés :
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DIAGNOSTIC_TYPES.map((diag) => {
                    const isDetected = detectedTypes.has(diag.id);
                    return (
                      <div key={diag.id} className="flex items-center gap-1.5">
                        {isDetected ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        ) : diag.required ? (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-secondary-300 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            'text-xs',
                            isDetected
                              ? 'text-secondary-700'
                              : 'text-secondary-400'
                          )}
                        >
                          {diag.label}
                          {diag.required && !isDetected && (
                            <span className="text-amber-500 ml-1">*</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {requiredDetected < requiredCount && (
                  <p className="text-xs text-amber-600 mt-2">
                    * {requiredCount - requiredDetected} diagnostic(s)
                    obligatoire(s) non détecté(s). La vérification complète aura
                    lieu lors de l'analyse.
                  </p>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
