import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { trackingService } from '@services/tracking.service';
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

// Lazy-loaded pro pages (own layout via ProLayout)
const ProDashboardPage = lazy(() => import('@pages/pro/ProDashboardPage'));
const ProRegisterPage = lazy(() => import('@pages/pro/ProRegisterPage'));
const ProSettingsPage = lazy(() => import('@pages/pro/ProSettingsPage'));
const ProDossierDetailPage = lazy(() => import('@pages/pro/ProDossierDetailPage'));
const ProCreditsPage = lazy(() => import('@pages/pro/ProCreditsPage'));
const ProPaymentSuccessPage = lazy(() => import('@pages/pro/ProPaymentSuccessPage'));
const ClientUploadPage = lazy(() => import('@pages/ClientUploadPage'));

// Lazy-loaded content pages
const FaqPage = lazy(() => import('@pages/content/FaqPage'));
const CommentCaMarche = lazy(() => import('@pages/content/CommentCaMarche'));
const VillesIndexPage = lazy(() => import('@pages/content/VillesIndexPage'));
const CityLandingPage = lazy(() => import('@pages/content/CityLandingPage'));
const RegionLandingPage = lazy(() => import('@pages/content/RegionLandingPage'));
const GuidesIndexPage = lazy(() => import('@pages/content/GuidesIndexPage'));
const GlossairePage = lazy(() => import('@pages/content/GlossairePage'));
const TarifPage = lazy(() => import('@pages/content/TarifPage'));
const ProfessionnelsPage = lazy(() => import('@pages/content/ProfessionnelsPage'));
const ComparatifConcurrentsPage = lazy(() => import('@pages/content/ComparatifConcurrentsPage'));
const MentionsLegalesPage = lazy(() => import('@pages/legal/MentionsLegalesPage'));
const PolitiqueRgpdPage = lazy(() => import('@pages/legal/PolitiqueRgpdPage'));
const CgvPage = lazy(() => import('@pages/legal/CgvPage'));
const BlogArticle = lazy(() => import('@pages/content/BlogArticle'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use requestAnimationFrame to scroll after React has committed the new DOM
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [pathname]);
  return null;
}

function TrackingInit() {
  useEffect(() => {
    trackingService.captureUTMs();
  }, []);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse-slow text-secondary-400">Chargement...</div>
    </div>
  );
}

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <ScrollToTop />
      <TrackingInit />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Pro pages — own layout (ProLayout with ProHeader) */}
          <Route path="/pro" element={<ProDashboardPage />} />
          <Route path="/pro/register" element={<ProRegisterPage />} />
          <Route path="/pro/settings" element={<ProSettingsPage />} />
          <Route path="/pro/dossier/:dossierId" element={<ProDossierDetailPage />} />
          <Route path="/pro/credits" element={<ProCreditsPage />} />
          <Route path="/pro/credits/success" element={<ProPaymentSuccessPage />} />

          {/* Client upload — minimal branded header */}
          <Route path="/client/:uploadToken" element={<ClientUploadPage />} />

          {/* Main site — standard Header + Footer layout */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/dossier" element={<MainLayout><DossierPage /></MainLayout>} />
          <Route path="/dossier/:sessionId" element={<MainLayout><DossierPage /></MainLayout>} />
          <Route path="/payment/success" element={<MainLayout><PaymentSuccessPage /></MainLayout>} />
          <Route path="/payment/cancel" element={<MainLayout><PaymentCancelPage /></MainLayout>} />
          <Route path="/share/:shareToken" element={<MainLayout><NotarySharePage /></MainLayout>} />

          {/* Content pages */}
          <Route path="/faq" element={<MainLayout><FaqPage /></MainLayout>} />
          <Route path="/comment-ca-marche" element={<MainLayout><CommentCaMarche /></MainLayout>} />
          <Route path="/guide" element={<MainLayout><GuidesIndexPage /></MainLayout>} />
          <Route path="/guide/:slug" element={<MainLayout><BlogArticle /></MainLayout>} />
          <Route path="/glossaire" element={<MainLayout><GlossairePage /></MainLayout>} />
          <Route path="/tarif" element={<MainLayout><TarifPage /></MainLayout>} />
          <Route path="/professionnels" element={<MainLayout><ProfessionnelsPage /></MainLayout>} />
          <Route path="/comparatif" element={<MainLayout><ComparatifConcurrentsPage /></MainLayout>} />
          <Route path="/pre-etat-date" element={<MainLayout><VillesIndexPage /></MainLayout>} />
          <Route path="/pre-etat-date/:citySlug" element={<MainLayout><CityLandingPage /></MainLayout>} />
          <Route path="/pre-etat-date/region/:regionSlug" element={<MainLayout><RegionLandingPage /></MainLayout>} />

          {/* Legal pages */}
          <Route path="/mentions-legales" element={<MainLayout><MentionsLegalesPage /></MainLayout>} />
          <Route path="/politique-rgpd" element={<MainLayout><PolitiqueRgpdPage /></MainLayout>} />
          <Route path="/cgv" element={<MainLayout><CgvPage /></MainLayout>} />

          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </Suspense>
      <Analytics />
    </TooltipProvider>
  );
}
