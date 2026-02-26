import { cn } from '@lib/utils';
import { FileText, Upload, Brain, ClipboardCheck, CreditCard, Share2 } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Questionnaire', icon: FileText, color: 'text-step-questionnaire' },
  { id: 2, label: 'Documents', icon: Upload, color: 'text-step-upload' },
  { id: 3, label: 'Analyse IA', icon: Brain, color: 'text-step-analysis' },
  { id: 4, label: 'Validation', icon: ClipboardCheck, color: 'text-step-validation' },
  { id: 5, label: 'Paiement', icon: CreditCard, color: 'text-step-payment' },
  { id: 6, label: 'Livraison', icon: Share2, color: 'text-step-delivery' },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isPending = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-green-500 border-green-500 text-white',
                    isActive && `border-current ${step.color} bg-white`,
                    isPending && 'border-secondary-300 text-secondary-300 bg-white'
                  )}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span
                  className={cn(
                    'text-[10px] md:text-xs font-medium whitespace-nowrap',
                    isCompleted && 'text-green-600',
                    isActive && 'text-secondary-900',
                    isPending && 'text-secondary-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 md:mx-3 mt-[-1.25rem]',
                    step.id < currentStep ? 'bg-green-500' : 'bg-secondary-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
