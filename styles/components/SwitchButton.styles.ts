/**
 * @file SwitchButton.styles.ts
 * @description Defines the visual styles and color themes for the SwitchButton component.
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

/**
 * Color theme configuration for the switch variants.
 * * Available Themes:
 * - **mission**: Orange active button (#FF9A66) on an Orange background.
 * - **auth**: Violet active button (#A9A7ED) on a Violet background.
 * * Note: The background (track) color is specific to the theme variant.
 */
export const THEMES = {
    mission: {
        background: Colors.lightOrange,
        activeButton: Colors.white,        // Selected button color
        activeText: Colors.black,
        inactiveText: Colors.black,
    },
    auth: {
        background: Colors.inputBackground, // Track background color
        activeButton: Colors.lightViolet,  // Specific violet color for Auth
        activeText: Colors.white,
        inactiveText: Colors.white,
    },
    userType: {
        background: Colors.brightOrange,
        activeButton: Colors.lightOrange,        // Selected button color
        activeText: Colors.white,
        inactiveText: Colors.white,
    },
};

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentedControl: {
        flexDirection: 'row',
        borderRadius: 100,
        padding: 4,
        width: 250,
        minHeight: 44,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    activeButton: {
        backgroundColor: 'transparent', 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    }
});