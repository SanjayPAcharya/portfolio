import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ContactsList = lazy(() => import('./components/ContactsList'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/cl"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <ContactsList />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
