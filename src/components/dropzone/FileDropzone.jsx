import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils';
import { Upload, FileText } from 'lucide-react';

export default function FileDropzone({ onDrop, isUploading }) {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (onDrop) onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-secondary-300 bg-white hover:border-primary-400 hover:bg-primary-50/50',
        isUploading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {isDragActive ? (
          <>
            <FileText className="h-12 w-12 text-primary-500" />
            <p className="text-primary-600 font-medium">Déposez vos fichiers ici...</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-secondary-400" />
            <div>
              <p className="text-secondary-700 font-medium">
                {isUploading ? 'Upload en cours...' : 'Glissez-déposez vos PDF ici'}
              </p>
              <p className="text-sm text-secondary-500 mt-1">
                ou cliquez pour sélectionner des fichiers
              </p>
            </div>
            <p className="text-xs text-secondary-400">PDF uniquement</p>
          </>
        )}
      </div>
    </div>
  );
}
