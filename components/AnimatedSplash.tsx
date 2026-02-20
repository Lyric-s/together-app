import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

type Props = {
    onAnimationFinish: () => void;
};

/**
 * Displays a centered splash image and runs a fade-in, pause, and fade-out animation, invoking the provided callback when the animation completes.
 *
 * @param onAnimationFinish - Callback invoked when the animation sequence finishes (called only if the animation completed).
 * @returns The splash screen React element with the image opacity animated. 
 */
export default function AnimatedSplashScreen({ onAnimationFinish }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.sequence([
            // Fade In
            Animated.timing(opacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            // Wait
            Animated.delay(800),
            // Fade Out
            Animated.timing(opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]);
        animation.start(({ finished }) => {
            if (finished) onAnimationFinish();
        });
        return () => {
            animation.stop();
        };
    }, [opacity, onAnimationFinish]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('@/assets/images/splash_art.png')}
                style={[styles.image, { opacity }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Assurez-vous que ça matche la couleur de votre splash natif
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 180,
        height: 180,
    },
});