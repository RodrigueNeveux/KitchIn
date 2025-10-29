import { createRoot } from 'react-dom/client';
import React from 'react'; // Ajout de l'import React

// 1. Importez l'application complète
import App from './App'; 

// 2. Importez le Toaster (composant de notification)
import { Toaster } from './components/ui/sonner'; 

// CORRECTION DU CHEMIN CSS : Utilisation de l'alias '@/' pour une résolution fiable dans le build Vercel.
import './index.css';
const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');

// 3. Rendu de l'application complète et du Toaster
// Ajout de React.StrictMode pour améliorer la compatibilité en production
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" />
  </React.StrictMode>
);
