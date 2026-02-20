import React from 'react';
import { TouchableOpacity, Image, View, StyleProp, ViewStyle } from 'react-native';
import styles from '@/styles/components/Cross.styles';

type Props = {
    onClose?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Renders a tappable close (X) icon.
 *
 * @param onClose - Optional callback invoked when the close button is pressed
 * @param containerStyle - Optional style to merge with the component's outer container
 * @returns The rendered close button element
 */
export default function Cross({ onClose, containerStyle }: Props) {
    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
                <Image
                    source={require('@/assets/images/close.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
}