import React from 'react';
import { TextInput, TextInputProps, StyleSheet, TextStyle } from 'react-native';
import styles from '@/styles/components/InputField.styles';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Render a TextInput that forwards all props and applies language-aware typography.
 *
 * The component merges external styles with a language-derived `fontSize` and `fontFamily`. If the incoming `style` includes a `fontSize`, that value is used as the base size for language scaling; otherwise a default base of 14 is used.
 *
 * @param props - Props forwarded to the underlying TextInput; `style` may include `fontSize` which will be used as the base for language scaling
 * @returns A TextInput element with merged styles and language-aware font settings
 */
export default function InputField(props: TextInputProps) {
    const { getFontSize, fontFamily } = useLanguage();
    
    // Extract fontSize from incoming style if present, or default to 14
    const flatStyle = StyleSheet.flatten(props.style || {}) as TextStyle;
    const baseFontSize = flatStyle.fontSize || 14;

    return (
        <TextInput
            {...props}
            placeholderTextColor="#E5DFFF"
            style={[
                styles.field, 
                props.style,
                { 
                    fontSize: getFontSize(baseFontSize),
                    fontFamily: fontFamily
                }
            ]}
        />
    );
}