/**
 * @file SwitchButton.tsx
 * @description Composant de contrôle segmenté réutilisable et personnalisable.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { styles, THEMES } from '@/styles/components/SwitchButton.styles';

export type SwitchVariant = 'mission' | 'auth' | 'userType' | 'activityVolunteer' | 'activityAssociation';

export interface SwitchButtonProps {
    variant?: SwitchVariant; // Colors
    labelLeft?: string;
    labelRight?: string;
    value?: string; // button value
    defaultValue?: string;
    onChange?: (tab: string) => void;
    style?: StyleProp<ViewStyle>;
}

/**
 * Render a two-option segmented control that can be themed and either controlled or uncontrolled.
 *
 * The control uses a per-variant theme and optional built-in navigation routes. When `value` is provided the component is controlled; otherwise it manages its own active tab starting from `defaultValue` (or the left label). If `onChange` is supplied it is called on tab change. If `onChange` is not supplied and both `labelLeft` and `labelRight` are omitted, the component will navigate to the variant's configured route for the selected side.
 *
 * @param variant - Visual and routing variant to use (affects labels, colors, and default routes)
 * @param labelLeft - Optional override for the left button label; when provided disables automatic routing
 * @param labelRight - Optional override for the right button label; when provided disables automatic routing
 * @param value - Controlled active tab label; when set, internal state is ignored
 * @param defaultValue - Initial active tab label for uncontrolled usage
 * @param onChange - Optional callback invoked with the new active tab label on user selection
 * @param style - Optional container style override
 * @returns The rendered segmented switch component
 */
export default function SwitchButton({ 
    variant = 'mission', 
    labelLeft,
    labelRight,
    value, 
    defaultValue, 
    onChange, 
    style 
}: SwitchButtonProps) {
    
    const config = {
        mission: {
            left: 'Mission',
            right: 'Association',
            routes: { left: '/(volunteer)/search/mission', right: '/(volunteer)/search/association' },
            theme: THEMES.mission
        },
        auth: {
            left: 'Inscription',
            right: 'Connexion',
            routes: { left: '/(auth)/register', right: '/(auth)/login' },
            theme: THEMES.auth
        },
        userType : {
            left: 'Bénévole',
            right: 'Association',
            routes: { left: '/(auth)/register', right: '/(auth)/register' },
            theme: THEMES.userType
        },
        activityVolunteer : {
            left: 'A venir',
            right: 'Historique',
            routes: { left: '/(volunteer)/library/upcoming', right: '/(volunteer)/library/history' },
            theme: THEMES.mission
        },
        activityAssociation : {
            left: 'A venir',
            right: 'Historique',
            routes: { left: '/(association)/library/upcoming', right: '/(association)/library/history' },
            theme: THEMES.mission
        },
    };

    const currentConfig = config[variant] || config.mission;
    
    const finalLeftLabel = labelLeft || currentConfig.left;
    const finalRightLabel = labelRight || currentConfig.right;

    const initialTab = defaultValue || finalLeftLabel;
    const [internalActiveTab, setInternalActiveTab] = useState<string>(initialTab);
    const router = useRouter();

    // L'onglet actif est soit celui passé en prop (value), soit l'interne
    const activeTab = value ?? internalActiveTab;

    const handlePress = (tabName: string, side: 'left' | 'right') => {
        if (value === undefined) {
            setInternalActiveTab(tabName);
        }
        
        if (onChange) {
            onChange(tabName);
        } else if (!labelLeft && !labelRight) {
            const route = currentConfig.routes[side];
            if (route) {
                // @ts-ignore
                router.push(route);
            }
        }
    };

    const getTextStyle = (isActive: boolean) => ({
        color: isActive ? currentConfig.theme.activeText : currentConfig.theme.inactiveText,
        opacity: isActive ? 1 : 0.7,
        fontWeight: isActive ? ('600' as const) : ('400' as const),
    });

    const getButtonStyle = (isActive: boolean) => {
        const baseStyle = styles.button;
        if (!isActive) return baseStyle;
        
        return [
            baseStyle,
            styles.activeButton,
            { backgroundColor: currentConfig.theme.activeButton }
        ];
    };

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.segmentedControl, { backgroundColor: currentConfig.theme.background }]}>
                
                {/* Bouton Gauche */}
                <TouchableOpacity
                    style={getButtonStyle(activeTab === finalLeftLabel)}
                    onPress={() => handlePress(finalLeftLabel, 'left')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.text, getTextStyle(activeTab === finalLeftLabel)]}>
                        {finalLeftLabel}
                    </Text>
                </TouchableOpacity>

                {/* Bouton Droit */}
                <TouchableOpacity
                    style={getButtonStyle(activeTab === finalRightLabel)}
                    onPress={() => handlePress(finalRightLabel, 'right')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.text, getTextStyle(activeTab === finalRightLabel)]}>
                        {finalRightLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}