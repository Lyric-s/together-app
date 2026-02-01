import React from 'react';
import { TextInput, TextInputProps, StyleSheet, TextStyle } from 'react-native';
import styles from '@/styles/components/InputField.styles';
import { useLanguage } from '@/context/LanguageContext';

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