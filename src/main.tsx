import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ContactsList = lazy(() => import('./components/ContactsList'));
const EC2Controls = lazy(() => import('./components/EC2Controls'));
const EditorialInk = lazy(() => import('./pages/EditorialInk'));
const AgentConsole = lazy(() => import('./pages/AgentConsole'));
const BrutalPop = lazy(() => import('./pages/BrutalPop'));
const NeonWave = lazy(() => import('./pages/NeonWave'));

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
        <Route
          path="/ec2controls"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <EC2Controls />
            </Suspense>
          }
        />
        <Route
          path="/dev"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <EditorialInk />
            </Suspense>
          }
        />
        <Route
          path="/agent"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <AgentConsole />
            </Suspense>
          }
        />
        <Route
          path="/brutal"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <BrutalPop />
            </Suspense>
          }
        />
        <Route
          path="/neon"
          element={
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <NeonWave />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
