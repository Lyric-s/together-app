/**
 * @file MobileNavigationBarStyles.ts
 * @description Definition of styles for the mobile navigation bar.
 * This file manages the visual appearance, including the handling of
 * differentiated drop shadows between iOS and Android (elevation system).
 */

import { StyleSheet } from 'react-native';

/**
 * Styles for the MobileNavigationBar component.
 * * @constant styles
 * @category Styles
 * * @property {ViewStyle} navBar - Main horizontal container.
 * - Uses `elevation` for Android to create a material shadow.
 * - Uses `shadow*` properties for iOS for precise blur rendering.
 * - The fixed 60px height ensures a standard touch target area.
 * * @property {ViewStyle} tabButton - Individual container for each icon.
 * - `flex: 1` allows the space to be divided equally among all tabs.
 * - `position: relative` is necessary to position the activeIndicator absolutely.
 * * @property {ViewStyle} activeIndicator - Small colored line at the top of the tab.
 * - Positioned as `absolute` so as not to shift the central icon.
 * - Rounded bottom corners create an elegant "pill" look.
 */
export const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        // Elevation for Android (Material Design layer system)
        elevation: 10,
        // Shadow parameters for iOS (Quartz Core)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        width: 40,
        height: 4,
        backgroundColor: '#F97316',
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
});