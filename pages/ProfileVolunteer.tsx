import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import AlertToast from '@/components/AlertToast';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/ProfilCSS';
import{styles1} from '@/styles/pages/ProfileVolunteerCSS';
import ProfilCard from '@/components/ProfilCard';
import ImageButton from '@/components/ImageButton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { volunteerService } from '@/services/volunteerService';
import { Volunteer, VolunteerUpdate } from '@/models/volunteer.model';

// Importez les types définis pour ProfilCard
import { VolunteerProfile } from '@/types/ProfileUser';
import { router } from 'expo-router';
import Calendar from '@/components/Calendar';

// Interface locale pour l'affichage du calendrier
interface MissionDay {
  id: string; // Changé en string pour matcher souvent les IDs de listes React
  time: string;
  title: string;
  image?: any;
}

/**
 * Display the volunteer profile screen with responsive mobile and desktop layouts, including profile fetching, editing, calendar, mission statistics, and navigation actions.
 *
 * The component fetches the current volunteer profile on mount, shows a loading indicator while fetching, presents an editable profile form (ProfilCard) with save validation and alerts, and renders a calendar and mission statistics alongside navigation shortcuts for rewards, profile modification, calendar, and settings.
 *
 * @returns The rendered React element for the volunteer profile screen.
 */
export default function ProfilVolunteer() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const isMobile = Platform.OS !== 'web';

  const { refetchUser } = useAuth();
  const { t } = useLanguage();
  
  const [profileUser, setProfilUSer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });

  const missionsAccomplies = profileUser?.finished_missions_count || 0;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const volunteerData = await volunteerService.getMe();
      setProfilUSer(volunteerData);
    } catch (e) {
      console.error(e);
      setAlertModal({ visible: true, title: t('error'), message: t('loadError') });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAlertClose = () => setAlertModal(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, message: string) => setAlertModal({ visible: true, title, message });

  const handleSave = async (updatedData: VolunteerUpdate & { confirmPassword?: string }): Promise<void> => {
    if (!profileUser?.id_volunteer) {
        showAlert(t('error'), t('idNotFound'));
        return;
    }

    const requiredFields: (keyof VolunteerUpdate)[] = ['first_name', 'last_name', 'email'];
    for (const field of requiredFields) {
        if (!updatedData[field] || updatedData[field]?.trim() === '') {
            showAlert(t('error'), `${t('error')}: ${field}`); // Simple fallback for specific field error
            return;
        }
    }

    const { password, confirmPassword, ...profileData } = updatedData;

    if (password) {
        if (password !== confirmPassword) {
            showAlert(t('error'), t('pwdMismatch'));
            return;
        }
        (profileData as any).password = password;
    }
    
    try {
        const result = await volunteerService.updateMe(profileUser.id_volunteer, profileData);
        setProfilUSer(result);
        await refetchUser(); 
        showAlert(t('success'), t('success'));

    } catch (error) {
        console.error("Échec de la mise à jour du profil:", error);
        showAlert(t('error'), t('error'));
    }
  };

    const navToRewards = () => router.push('/(volunteer)/profile/rewardsMobile');
    const navToInfo = () => router.push('/(volunteer)/profile/profileModifMobile');
    const navToCalendar = () => router.push('/(volunteer)/profile/calendarMobile');
    const navToSettings = () => router.push('/settings');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
        <Text style={{ marginTop: 10, color: 'gray' }}>{t('loadingProfile')}</Text>
      </View>
    );
  }
  if (!profileUser) {
    return (
      <>
        <AlertToast
          visible={alertModal.visible}
          title={alertModal.title}
          message={alertModal.message}
          onClose={handleAlertClose}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 10, color: 'gray' }}>{t('loadError')}</Text>
          {/* Optional: add a retry action that calls loadProfile() */}
        </View>
      </>
    );
  }

  // --- CORRECTION DU TYPE ICI ---
  // On type explicitement userDataForCard en VolunteerProfile
  const userDataForCard: VolunteerProfile = {
      // Champs BaseProfile
      username: profileUser.user?.username || '',
      email: profileUser.user?.email || '',
      
      // Champs VolunteerProfile
      // IMPORTANT : 'as const' ou typage explicite pour dire que c'est bien "volunteer" et pas string
      type: 'volunteer', 
      id_volunteer: profileUser.id_volunteer,
      first_name: profileUser.first_name,
      last_name: profileUser.last_name,
      phone_number: profileUser.phone_number,
      birthdate: profileUser.birthdate,
      
      // Champs Optionnels
      address: profileUser.address,
      zip_code: profileUser.zip_code,
      skills: profileUser.skills,
      bio: profileUser.bio,
      
      // Champs pour le formulaire (vides par défaut pour ne pas afficher de mots de passe)
      password: '',
      confirmPassword: ''
  };

  if (isMobile) {
    return (
        <ScrollView style={[styles.content, {backgroundColor: Colors.white}]} contentContainerStyle={{ paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
            <View style={{alignItems: 'center'}}>
                <Image source={require('@/assets/images/profil-picture.png')} style={styles.profilIcon} />
                <Text style={[styles.menuLabel, {marginVertical: 10, fontSize: 25, fontWeight: 'bold'}]}>
                    {profileUser.first_name} {profileUser.last_name}
                </Text>
            </View>

            <View style={styles.separatorLine} />

            <View style={styles.statsCardMobile}>
                <Text style={[styles.menuLabel, {marginVertical: 10, marginTop: 50, fontSize: 17, fontWeight: 'bold'}]}>{t('accomplishedMissions')}</Text>
                <Text style={styles.statsNumber}>{missionsAccomplies}</Text>
            </View>

            <View style={styles.menuGrid}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <TouchableOpacity style={styles.menuCard} disabled={true} onPress={navToRewards}>
                        <View style={styles.menuIconContainer}>
                            <Image
                                source={require('@/assets/images/award.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>{t('myRewards')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuCard} onPress={navToInfo}>
                        <View style={[styles.menuIconContainer, { backgroundColor: Colors.lightPurple }]}>
                            <Image
                                source={require('@/assets/images/edit_profil.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>{t('myInfo')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <TouchableOpacity style={styles.menuCard} onPress={navToCalendar}>
                        <View style={[styles.menuIconContainer, { backgroundColor: Colors.lightPurple }]}>
                            <Image
                                source={require('@/assets/images/calender.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>{t('myCalendar')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuCard} onPress={navToSettings}>
                        <View style={styles.menuIconContainer}>
                            <Image
                                source={require('@/assets/images/parameters.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>{t('settings')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        );
    }

  return (
    <LinearGradient
        colors={[Colors.white, Colors.orangeVeryLight]}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
    >
        <AlertToast
            visible={alertModal.visible}
            title={alertModal.title}
            message={alertModal.message}
            onClose={handleAlertClose}
        />
        <ScrollView 
            contentContainerStyle={styles1.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
            <View style={styles1.headerContainer}>
                <Text style={[styles1.pageTitle, isSmallScreen ? {paddingLeft : 40} : {}]}>{t('myProfile')}</Text>
                <Text style={[styles1.headerSubtitle, isSmallScreen ? {paddingLeft : 40} : {}]}>{t('allYourData')}</Text>
            </View>
            <View style={[styles1.mainLayout, !isMobile && { flexDirection: 'column', alignItems: 'center', gap: 20 }]}>
                {/* On ne gère plus de colonnes, on met les éléments les uns après les autres */}
                <ProfilCard
                    userType='volunteer'
                    userData={userDataForCard}
                    onSave={handleSave}
                    showAlert={showAlert}
                />
                
                {/* Conteneur pour le calendrier et les stats, pour les garder ensemble */}
                <View style={{ width: '100%', maxWidth: 800, gap: 20 }}>
                    <View style={styles1.sectionContainer}>
                        <Text style={styles1.sectionTitle}>{t('myCalendar')}</Text>
                        <Calendar />
                    </View>

                    <View style={styles1.statsCard}>
                        <View style={styles1.statsContent}>
                            <Text style={styles1.statsLabel}>
                                {t('accomplishedMissions')}
                            </Text>
                            <Text style={styles1.statsNumber}>{missionsAccomplies}</Text>
                        </View>
                        <ImageButton onPress={true ? undefined : navToRewards} image={require('@/assets/images/reward.png')} />
                    </View>
                </View>
            </View>
            </ScrollView>
        </LinearGradient>
    );
}