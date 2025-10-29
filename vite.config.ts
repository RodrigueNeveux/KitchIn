import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // SOLUTION DU PROBLÈME DE CSS :
  // Force Vite à utiliser des chemins relatifs pour les assets (CSS/JS)
  // afin qu'ils soient trouvés correctement sur le serveur Vercel.
  base: './', 
  
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Nettoyage et simplification de la gestion des alias
      // Remplacement de tous les alias longs par le chemin d'origine.
      // Le chemin '@' est conservé pour la clarté.
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    // outDir est déjà sur 'build', ce qui est correct pour Vercel.
    outDir: 'build', 
  },
  server: {
    port: 3000,
    open: true,
  },
});
