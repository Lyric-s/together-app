import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';

export interface ThemedTextProps extends RNTextProps {
  style?: TextStyle | TextStyle[];
}

export const Text = (props: ThemedTextProps) => {
  const { getFontSize, fontFamily, fontFamilyBold } = useLanguage();
  const { style, ...otherProps } = props;

  // Flatten styles to extract properties
  const flatStyle = StyleSheet.flatten(style || {}) as TextStyle;
  
  // Use existing fontSize as base, or default to 14
  const baseFontSize = flatStyle.fontSize || 14;
  
  // Calculate dynamic font size
  const scaledFontSize = getFontSize(baseFontSize);

  // Determine font family
  let appliedFontFamily = flatStyle.fontFamily;
  
  // If a global font family is set (e.g. OpenDyslexic), it overrides unless specific logic dictates otherwise
  if (fontFamily) {
    // Check if the text is bold to select the bold variant of the custom font
    const fontWeight = flatStyle.fontWeight;
    const isBold = fontWeight === 'bold' || fontWeight === '700' || fontWeight === '800' || fontWeight === '900';
    
    // Apply bold font if available and needed, otherwise normal custom font
    appliedFontFamily = isBold ? (fontFamilyBold || fontFamily) : fontFamily;
  }

  const dynamicStyle = {
    ...flatStyle,
    fontSize: scaledFontSize,
    fontFamily: appliedFontFamily,
  };

  return <RNText style={dynamicStyle} {...otherProps} />;
};
