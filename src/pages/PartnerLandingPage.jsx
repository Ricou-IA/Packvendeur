import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { trackingService } from '@services/tracking.service';

export default function PartnerLandingPage() {
  const { partnerSlug } = useParams();

  const captured = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return trackingService.setPartner(partnerSlug);
  }, [partnerSlug]);

  useEffect(() => {
    if (captured?.partner_id) {
      trackingService.trackEvent(
        'partner_captured',
        'acquisition',
        {
          partner_id: captured.partner_id,
          partner_name: captured.partner_name,
        },
      );
    }
  }, [captured?.partner_id, captured?.partner_name]);

  return <Navigate to="/" replace />;
}
