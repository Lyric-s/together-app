import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styles from '@/styles/components/InputField.styles';

export default function InputField(props: TextInputProps) {
    return (
        <TextInput
            {...props}
            placeholderTextColor="#E5DFFF"
            style={[styles.field, props.style]}
        />
    );
}