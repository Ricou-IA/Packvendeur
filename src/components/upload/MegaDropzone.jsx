import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, Loader2, FileText } from 'lucide-react';
import { cn } from '@lib/utils';

/**
 * Mega-dropzone "tout en vrac" — l'IA classifie automatiquement chaque doc
 * et le range dans son slot indispensable / Pack Pro.
 * Reste additif : les slots individuels acceptent toujours les drops.
 */
export default function MegaDropzone({
  onDrop,
  isUploading,
  isClassifying,
  pendingCount = 0,
  className,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (onDrop) onDrop(acceptedFiles);
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const showSpinner = isUploading || isClassifying || pendingCount > 0;

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 border-dashed transition-all cursor-pointer group',
        'bg-gradient-to-br from-primary-50/80 via-white to-blue-50/40',
        isDragActive
          ? 'border-primary-500 ring-4 ring-primary-200 scale-[1.01]'
          : 'border-primary-200 hover:border-primary-400 hover:shadow-md',
        className,
      )}
    >
      <input {...getInputProps()} />

      {/* Decorative blob */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-6 py-8 sm:py-10 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 mb-4 group-hover:scale-105 transition-transform">
          {showSpinner ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : isDragActive ? (
            <Upload className="h-7 w-7" />
          ) : (
            <Sparkles className="h-7 w-7" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-1">
          {isDragActive
            ? 'Déposez ici'
            : pendingCount > 0
              ? `${pendingCount} document${pendingCount > 1 ? 's' : ''} en analyse…`
              : 'Glissez vos documents en vrac'}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-secondary-500 max-w-md mx-auto leading-relaxed mb-4">
          {pendingCount > 0
            ? 'On reconnaît, on classe, on renomme — c\'est presque fini.'
            : 'PV d\'AG, appels de fonds, DPE, diagnostics… On reconnaît, on range, on renomme.'}
        </p>

        {/* Pills */}
        <div className="inline-flex items-center gap-2 flex-wrap justify-center text-xs text-secondary-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-secondary-200 rounded-full">
            <FileText className="h-3 w-3" />
            PDF uniquement
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-secondary-200 rounded-full">
            Multi-fichiers
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-secondary-200 rounded-full">
            5 Mo max / fichier
          </span>
        </div>
      </div>
    </div>
  );
}
