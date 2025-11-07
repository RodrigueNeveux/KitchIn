import { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
  darkMode: boolean;
  className?: string;
}

/**
 * Wrapper qui FORCE les styles de thème avec inline styles
 * pour contourner les problèmes de navigateur qui force le dark mode
 */
export function ThemeWrapper({ children, darkMode, className = '' }: ThemeWrapperProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: darkMode ? '#0f172a' : 'white',
        color: darkMode ? '#f1f5f9' : '#0f172a',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper pour les surfaces (cards, panels)
 */
export function ThemeSurface({ children, darkMode, className = '' }: ThemeWrapperProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: darkMode ? '#1e293b' : '#f9fafb',
        color: darkMode ? '#f1f5f9' : '#0f172a',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper pour les cards
 */
export function ThemeCard({ children, darkMode, className = '' }: ThemeWrapperProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: darkMode ? '#1e293b' : 'white',
        color: darkMode ? '#f1f5f9' : '#0f172a',
        borderColor: darkMode ? '#334155' : '#e5e7eb',
        transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Hook pour obtenir les styles inline basés sur le darkMode
 */
export function useThemeStyles(darkMode: boolean) {
  return {
    // Fond principal
    background: {
      backgroundColor: darkMode ? 'black' : 'white',
      color: darkMode ? 'white' : 'black',
    },
    
    // Surface (gris léger)
    surface: {
      backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
      color: darkMode ? 'white' : 'black',
    },
    
    // Card
    card: {
      backgroundColor: darkMode ? '#374151' : 'white',
      color: darkMode ? 'white' : 'black',
      borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    },
    
    // Header
    header: {
      backgroundColor: darkMode ? '#1f2937' : 'white',
      color: darkMode ? 'white' : 'black',
    },
    
    // Texte secondaire
    textSecondary: {
      color: darkMode ? '#d1d5db' : '#6b7280',
    },
    
    // Texte muted
    textMuted: {
      color: darkMode ? '#9ca3af' : '#9ca3af',
    },
    
    // Border
    border: {
      borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    },
    
    // Input
    input: {
      backgroundColor: darkMode ? '#374151' : 'white',
      color: darkMode ? 'white' : 'black',
      borderColor: darkMode ? '#4b5563' : '#d1d5db',
    },
    
    // Button hover
    buttonHover: {
      backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
    },
  };
}
