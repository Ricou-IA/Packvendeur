/**
 * Reusable CTA section for blog articles.
 *
 * Renders a centered call-to-action box with heading, description,
 * and a button linking to the dossier creation page.
 *
 * All props are optional with sensible defaults.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';

export default function ArticleCta({
  title = "Prêt à générer votre pré-état daté ?",
  description = "24,99 €, prêt en 5 minutes. Conforme au modèle CSN, accepté par les notaires.",
  buttonText = "Générer mon pré-état daté",
  to = "/dossier",
}) {
  return (
    <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
      <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
        {title}
      </h2>
      <p className="text-secondary-500 mb-6">
        {description}
      </p>
      <Button size="lg" asChild>
        <Link to={to} className="gap-2">
          {buttonText}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </section>
  );
}
