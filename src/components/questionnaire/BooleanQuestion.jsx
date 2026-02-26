import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';

/**
 * Composant Oui/Non avec textarea conditionnel.
 * Utilise setValue du parent useForm pour gerer les booleens.
 */
export default function BooleanQuestion({
  id,
  label,
  hint,
  register,
  watch,
  setValue,
  detailsField,
  detailsLabel = 'Precisions',
  detailsPlaceholder = 'Donnez des details...',
}) {
  const value = watch(id);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-medium leading-tight">{label}</Label>
          {hint && <p className="text-xs text-secondary-400 mt-0.5">{hint}</p>}
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setValue(id, true, { shouldDirty: true })}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              value === true
                ? 'bg-primary-100 border-primary-400 text-primary-700 font-medium'
                : 'bg-white border-secondary-200 text-secondary-500 hover:border-secondary-300'
            }`}
          >
            Oui
          </button>
          <button
            type="button"
            onClick={() => setValue(id, false, { shouldDirty: true })}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              value === false
                ? 'bg-secondary-100 border-secondary-400 text-secondary-700 font-medium'
                : 'bg-white border-secondary-200 text-secondary-500 hover:border-secondary-300'
            }`}
          >
            Non
          </button>
        </div>
      </div>
      {value === true && detailsField && (
        <div className="ml-4 pl-4 border-l-2 border-primary-200">
          <Label className="text-xs text-secondary-500">{detailsLabel}</Label>
          <Textarea
            {...register(detailsField)}
            placeholder={detailsPlaceholder}
            className="mt-1 text-sm"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
