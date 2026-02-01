import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../constants/Translations';

type Language = 'fr' | 'en';
type TranslationKey = keyof typeof translations.fr;
type FontType = 'default' | 'opendyslexic';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  textSize: number;
  setTextSize: (size: number) => void;
  getFontSize: (baseSize: number) => number;
  fontType: FontType;
  setFontType: (font: FontType) => void;
  fontFamily: string | undefined;      // Pour le texte normal
  fontFamilyBold: string | undefined;  // Pour les titres (NOUVEAU)
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [textSize, setTextSize] = useState<number>(2);
  const [fontType, setFontType] = useState<FontType>('default');

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  const getFontSize = (baseSize: number) => {
    const multipliers = [0.85, 1, 1.15, 1.3, 1.5];
    const index = Math.min(Math.max(textSize - 1, 0), 4);
    return baseSize * multipliers[index];
  };

  // Logique : Si OpenDyslexic est activé, on renvoie les noms exacts définis dans _layout.tsx
  const fontFamily = fontType === 'opendyslexic' ? 'OpenDyslexic' : undefined;
  const fontFamilyBold = fontType === 'opendyslexic' ? 'OpenDyslexic-Bold' : undefined;

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, t, 
      textSize, setTextSize, getFontSize,
      fontType, setFontType, 
      fontFamily, 
      fontFamilyBold // On exporte la version grasse
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};