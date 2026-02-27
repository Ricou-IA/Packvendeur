import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TooltipProvider } from '@components/ui/tooltip';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import HomePage from '@pages/HomePage';
import NotFoundPage from '@pages/NotFoundPage';

// Lazy-loaded core pages (DossierPage pulls in @react-pdf/renderer ~1MB)
const DossierPage = lazy(() => import('@pages/DossierPage'));
const NotarySharePage = lazy(() => import('@pages/NotarySharePage'));
const PaymentSuccessPage = lazy(() => import('@pages/PaymentSuccessPage'));
const PaymentCancelPage = lazy(() => import('@pages/PaymentCancelPage'));

// Lazy-loaded content pages
const FaqPage = lazy(() => import('@pages/content/FaqPage'));
const CommentCaMarche = lazy(() => import('@pages/content/CommentCaMarche'));
const CityLandingPage = lazy(() => import('@pages/content/CityLandingPage'));
const RegionLandingPage = lazy(() => import('@pages/content/RegionLandingPage'));
const GuidesIndexPage = lazy(() => import('@pages/content/GuidesIndexPage'));
const GlossairePage = lazy(() => import('@pages/content/GlossairePage'));
const MentionsLegalesPage = lazy(() => import('@pages/legal/MentionsLegalesPage'));
const PolitiqueRgpdPage = lazy(() => import('@pages/legal/PolitiqueRgpdPage'));
const CgvPage = lazy(() => import('@pages/legal/CgvPage'));
const BlogArticle = lazy(() => import('@pages/content/BlogArticle'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse-slow text-secondary-400">Chargement...</div>
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dossier" element={<DossierPage />} />
              <Route path="/dossier/:sessionId" element={<DossierPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />
              <Route path="/share/:shareToken" element={<NotarySharePage />} />

              {/* Content pages */}
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
              <Route path="/guide" element={<GuidesIndexPage />} />
              <Route path="/guide/:slug" element={<BlogArticle />} />
              <Route path="/glossaire" element={<GlossairePage />} />
              <Route path="/pre-etat-date/:citySlug" element={<CityLandingPage />} />
              <Route path="/pre-etat-date/region/:regionSlug" element={<RegionLandingPage />} />

              {/* Legal pages */}
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/politique-rgpd" element={<PolitiqueRgpdPage />} />
              <Route path="/cgv" element={<CgvPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
