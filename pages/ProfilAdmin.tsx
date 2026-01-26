// pages/ProfilAdmin.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AlertToast from '@/components/AlertToast';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/ProfilCSS';
import ProfilCard from '@/components/ProfilCard';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, AdminProfile } from '@/types/ProfileUser';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Admin profile screen that displays and allows editing of the authenticated admin's profile.
 *
 * Fetches the current admin profile on load, redirects users who are not admins, shows loading and alert states,
 * and provides a save handler that updates the profile and refreshes authentication context.
 *
 * @returns The JSX element rendering the admin profile screen.
 */

export default function ProfilAdmin() {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 900;
    const isWeb = Platform.OS === 'web';
    const { t } = useLanguage();

    // We distinguish between page loading and authentication loading
    const { user, userType, isLoading: isAuthLoading, refetchUser } = useAuth();
    
    // Local loading for profile data
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [profileUser, setProfileUser] = useState<AdminProfile | null>(null);

    const [alertModal, setAlertModal] = useState({ 
        visible: false, 
        title: '', 
        message: '' 
    });

    const handleAlertClose = useCallback(() => {
        setAlertModal({ visible: false, title: '', message: '' })
    }, []);

    const showAlert = useCallback((title: string, message: string) => {
        setAlertModal({ visible: true, title, message });
    }, []);

    const fetchProfile = useCallback( async () => {
        setIsPageLoading(true);
        try {
            const data = await adminService.getMe();
            const profileData: AdminProfile = {
                type: 'admin',
                id_admin: data.id_admin,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                username: data.username,
                picture: null,
            };
            setProfileUser(profileData);
        } catch (error) {
            const message = error instanceof Error ? error.message : t('profileFetchError');
            showAlert(t('error'), message);
        } finally {
            setIsPageLoading(false);
        }
    }, [showAlert, t]);

    useEffect(() => {        
        if (user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    if (isAuthLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
                <ActivityIndicator size="large" color={Colors.orange} />
            </View>
        );
    }

    if (userType !== 'admin') {
        return <Redirect href="/(auth)/login" />;
    }

    const handleSave = async (data: UserProfile): Promise<void> => {
        if (!profileUser?.id_admin) {
            showAlert(t('error'), t('adminIdMissing'));
            return;
        }
        if (data.type !== 'admin') {
             showAlert(t('error'), t('invalidProfileType'));
             return;
        }
        try {
            const payloadAdmin = {
                last_name: data.last_name ?? profileUser.last_name,
                first_name: data.first_name ?? profileUser.first_name,
                email: data.email ?? profileUser.email,
                ...(data.password ? { password: data.password } : {})
            }
            await adminService.updateProfile(profileUser.id_admin, payloadAdmin);
            setProfileUser(prev => prev ? ({ ...prev, ...payloadAdmin }) : null);
            await refetchUser(); // Synchro AutoContext
            showAlert(t('success'), t('profileUpdateSuccess'));
        } catch (error) {
            const message = error instanceof Error ? error.message : t('profileUpdateFail');
            showAlert(t('error'), message);
        }
    }

    if (isPageLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
                <ActivityIndicator size="large" color={Colors.orange} />
                <Text style={{ marginTop: 10 }}>{t('loadingProfile')}</Text>
            </View>
        );
    }

    if (!isWeb) {
         return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>
                    {t('adminWebOnly')}
                </Text>
            </View>
        );
    }

    if (!profileUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{t('profileLoadError')}</Text>
            </View>
        );
    }

    return (
        <>
            <LinearGradient
                colors={[Colors.white, Colors.orangeVeryLight]}                style={{ flex: 1 }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
            <AlertToast
                visible={alertModal.visible}
                title={alertModal.title}
                message={alertModal.message}
                onClose={handleAlertClose}
            />
            <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.content}>
                        <Text style={[styles.pageTitle, isSmallScreen && {paddingLeft: 40}]}>{t('myProfile')}</Text>
                        <Text style={[styles.text, isSmallScreen && {paddingLeft: 40}]}>{t('allYourData')}</Text>
                        <View>
                            <ProfilCard
                                userType = 'admin'
                                userData = {profileUser}
                                onSave={handleSave}
                                showAlert={showAlert}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
            </LinearGradient>
        </>
    );
}