import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { FileText, Trash2 } from 'lucide-react';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function FileList({ documents, onRemove }) {
  if (!documents.length) return null;

  return (
    <div className="bg-white rounded-lg border divide-y">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-secondary-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {doc.original_filename}
              </p>
              <p className="text-xs text-secondary-500">
                {formatFileSize(doc.file_size_bytes)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc.document_type && doc.document_type !== 'other' && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                {doc.document_type.replace(/_/g, ' ')}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-secondary-400 hover:text-destructive"
              onClick={() => onRemove(doc.id, doc.storage_path)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="px-4 py-2 bg-secondary-50 text-xs text-secondary-500">
        {documents.length} document(s)
      </div>
    </div>
  );
}
