import { useState, useCallback } from 'react';
import { ademeService } from '@services/ademe.service';
import { toast } from '@components/ui/sonner';

export function useDpeVerification() {
  const [dpeResult, setDpeResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verify = useCallback(async (ademeNumber) => {
    if (!ademeNumber) return;

    setIsVerifying(true);
    try {
      const result = await ademeService.verifyDpe(ademeNumber);
      setDpeResult(result);

      if (result.validity === 'valid') {
        toast.success('DPE valide et opposable');
      } else if (result.validity === 'not_found') {
        toast.error('Numero ADEME non trouve');
      } else if (result.validity === 'expired') {
        toast.error('DPE expire');
      } else if (result.validity === 'not_opposable') {
        toast.warning('DPE anterieur au 01/07/2021 - Non opposable');
      } else if (result.validity === 'expiring_soon') {
        toast.warning('DPE expire bientot');
      }
    } catch (error) {
      toast.error('Erreur de verification');
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { dpeResult, isVerifying, verify };
}
