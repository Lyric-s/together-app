import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Text } from '@/components/ThemedText';
import styles from '@/styles/components/Button.styles';

type Props = {
    text: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

/**
 * Render an authentication-style button with a label, press handler, optional disabled state, and optional custom styles.
 *
 * Renders a touchable button that displays `text`. When `disabled` is true the button is visually dimmed and ignores presses.
 *
 * @param text - Label to display inside the button
 * @param onPress - Callback invoked when the button is pressed; ignored when `disabled` is true
 * @param disabled - When true, the button is non-interactive and rendered with reduced opacity
 * @param style - Additional style(s) merged with the component's base button style
 * @returns The rendered button element
 */
export default function ButtonAuth({ text, onPress, disabled = false, style }: Props) {
    return (
        <TouchableOpacity 
            style={[styles.button, style, disabled && { opacity: 0.6 }]} 
            onPress={disabled ? undefined : onPress}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            accessibilityState={{ disabled }}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}