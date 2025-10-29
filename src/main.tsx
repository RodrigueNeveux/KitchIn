import { createRoot } from 'react-dom/client';
import AppMinimal from './AppMinimal';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(<AppMinimal />);

// Pour revenir à l'app complète, remplacez AppMinimal par:
// import App from './App';
// import { Toaster } from './components/ui/sonner';
// createRoot(rootElement).render(<><App /><Toaster position="top-center" /></>);
