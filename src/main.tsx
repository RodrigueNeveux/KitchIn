import { createRoot } from 'react-dom/client';

// 1. Importez l'application complète
import App from './App'; 

// 2. Importez le Toaster (composant de notification)
import { Toaster } from './components/ui/sonner'; 

import './styles/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');

// 3. Rendu de l'application complète et du Toaster
createRoot(rootElement).render(
  <>
    <App />
    <Toaster position="top-center" />
  </>
);

// Supprimez ou commentez tout ce qui concerne AppMinimal
