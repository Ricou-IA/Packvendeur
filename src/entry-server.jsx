/**
 * Server entry point for pre-rendering.
 * Uses eager imports (no React.lazy) and StaticRouter instead of BrowserRouter.
 * Only includes SEO pages — dynamic routes (dossier, payment, share) are excluded.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@components/ui/tooltip';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';

// Eager imports — all SEO pages
import HomePage from '@pages/HomePage';
import NotFoundPage from '@pages/NotFoundPage';
import FaqPage from '@pages/content/FaqPage';
import CommentCaMarche from '@pages/content/CommentCaMarche';
import CityLandingPage from '@pages/content/CityLandingPage';
import RegionLandingPage from '@pages/content/RegionLandingPage';
import GuidesIndexPage from '@pages/content/GuidesIndexPage';
import GlossairePage from '@pages/content/GlossairePage';
import MentionsLegalesPage from '@pages/legal/MentionsLegalesPage';
import PolitiqueRgpdPage from '@pages/legal/PolitiqueRgpdPage';
import CgvPage from '@pages/legal/CgvPage';
import BlogArticleServer from '@pages/content/BlogArticleServer';

export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />

                {/* Content pages */}
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
                <Route path="/guide" element={<GuidesIndexPage />} />
                <Route path="/guide/:slug" element={<BlogArticleServer />} />
                <Route path="/glossaire" element={<GlossairePage />} />
                <Route path="/pre-etat-date/:citySlug" element={<CityLandingPage />} />
                <Route path="/pre-etat-date/region/:regionSlug" element={<RegionLandingPage />} />

                {/* Legal pages */}
                <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                <Route path="/politique-rgpd" element={<PolitiqueRgpdPage />} />
                <Route path="/cgv" element={<CgvPage />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  return { html, helmet };
}
