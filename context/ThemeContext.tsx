import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';

// Définition des couleurs pour chaque thème
export const themeColors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    headerBackground: '#FFE5D6', // Pêche
    card: '#F9F9F9',
    icon: '#000000',
    border: '#E0E0E0',
    tint: '#FF6B35', // Orange reste le même
  },
  dark: {
    background: '#121212', // Noir doux
    text: '#FFFFFF',
    headerBackground: '#2C2C2C', // Gris foncé
    card: '#1E1E1E', // Gris un peu plus clair
    icon: '#FFFFFF',
    border: '#333333',
    tint: '#FF6B35',
  }
};

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof themeColors.light; // Donne accès aux couleurs actuelles
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = isDarkMode ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {/* La StatusBar change automatiquement (noir sur blanc ou blanc sur noir) */}
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};