import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { Toaster } from '@components/ui/sonner';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

const rootElement = document.getElementById('root');

const appTree = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If the root already has content (pre-rendered HTML), hydrate instead of full render.
// This avoids a flash of empty content on pre-rendered SEO pages.
if (rootElement.children.length > 0) {
  ReactDOM.hydrateRoot(rootElement, appTree);
} else {
  ReactDOM.createRoot(rootElement).render(appTree);
}
