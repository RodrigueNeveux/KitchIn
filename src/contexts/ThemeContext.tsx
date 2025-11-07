import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Toujours en mode sombre
  const darkMode = true;

  useEffect(() => {
    // Toujours appliquer la classe dark
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook pour obtenir les styles inline pour le mode sombre uniquement
 */
export function useThemeStyles() {
  return {
    // Fond principal
    background: {
      backgroundColor: '#1f2937',
    },
    
    // Header
    header: {
      backgroundColor: '#1e293b',
    },
    
    // Card
    card: {
      backgroundColor: '#1e293b',
    },
  };
}