import React from 'react';
import { TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import styles from '@/styles/components/Button.styles';

type Props = {
    text: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function ButtonAuth({ text, onPress, disabled = false, style }: Props) {
    return (
        <TouchableOpacity 
            style={[styles.button, style, disabled && { opacity: 0.6 }]} 
            onPress={disabled ? undefined : onPress}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}
