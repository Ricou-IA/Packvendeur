import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/ui/collapsible';
import { Upload, FileText, Trash2, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function CategorySection({
  category,
  documents,
  onUpload,
  onRemove,
  isUploading,
  index,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = category.icon;
  const docCount = documents.length;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (onUpload) onUpload(acceptedFiles, category.id);
    },
    [onUpload, category.id]
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
              <div className={cn(
                'flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold',
                docCount > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-secondary-100 text-secondary-500'
              )}>
                {index + 1}
              </div>
              <Icon className="h-5 w-5 text-secondary-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-secondary-900">{category.title}</p>
                <p className="text-xs text-secondary-500">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {docCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {docCount} doc{docCount > 1 ? 's' : ''}
                </Badge>
              )}
              <ChevronDown className={cn(
                'h-4 w-4 text-secondary-400 transition-transform',
                isOpen && 'rotate-180'
              )} />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {/* Mini dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
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
                    ? 'Deposez ici...'
                    : isUploading
                    ? 'Upload en cours...'
                    : 'Glissez vos PDF ou cliquez'}
                </p>
              </div>
            </div>

            {/* File list */}
            {documents.length > 0 && (
              <div className="rounded-lg border divide-y">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                      <p className="text-sm text-secondary-800 truncate">
                        {doc.original_filename}
                      </p>
                      <span className="text-xs text-secondary-400 flex-shrink-0">
                        {formatFileSize(doc.file_size_bytes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.document_type ? (
                        <Badge variant="outline" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {doc.document_type.replace(/_/g, ' ')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs gap-1 text-secondary-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          analyse...
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-secondary-400 hover:text-destructive"
                        onClick={() => onRemove(doc.id, doc.storage_path)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
