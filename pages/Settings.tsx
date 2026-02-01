import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { styles } from '@/styles/pages/SettingsStyle';
import BottomNavBar from '@/components/MobileNavigationBar'; 
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext'; 
import { volunteerService } from '@/services/volunteerService'; 
import { associationService } from '@/services/associationService';
import { UserType } from '@/models/enums';
import { Colors } from '@/constants/colors';

const PageReglages = () => { 
  const router = useRouter(); 
  const { logout, user } = useAuth(); 
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const allMenuItems = [
    { title: t('notifications'), icon: 'notifications-outline', route: '/settings/notifications', description: t('notificationsDesc'), requiresAuth: true },
    { title: t('accessibility'), icon: 'accessibility-outline', route: '/settings/accessibility', description: t('accessibilityDesc') },
    { title: t('contacts'), icon: 'call-outline', route: '/settings/contact', description: t('contactsDesc') },
    { title: t('termsConditions'), icon: 'document-text-outline', route: '/settings/terms', description: t('termsDesc') },
    { title: t('privacyPolicy'), icon: 'shield-checkmark-outline', route: '/settings/privacy', description: t('privacyDesc') },
    { title: t('about'), icon: 'information-circle-outline', route: '/settings/about', description: t('aboutDesc') },
  ];

  const menuItems = allMenuItems.filter(item => !item.requiresAuth || user);

  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccountTitle'),
      t('deleteAccountMsg'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        { 
          text: t('delete'), 
          onPress: async () => {
            if (!user) {
                Alert.alert(t('error'), t('unidentifiedUser'));
                return;
            }

            try {
              if (user.user_type === UserType.VOLUNTEER && user.id_volunteer) {
                  await volunteerService.deleteProfile(user.id_volunteer);
              } else if (user.user_type === UserType.ASSOCIATION && user.id_asso) {
                  await associationService.delete(user.id_asso);
              } else {
                  Alert.alert(t('error'), t('unsupportedUserType'));
                  return;
              }

              Alert.alert(t('deleteAccountTitle'), t('deleteAccountSuccess'));
              logout(); 
            } catch (error) {
              console.error("Erreur de suppression du compte:", error);
              Alert.alert(t('error'), t('deleteError'));
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // --- VERSION WEB ---
  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: colors.text }}>
          {t('settings')}
        </Text>
        <Text style={{ fontSize: 16, color: 'gray', marginBottom: 40 }}>
          {t('settingsDesc')}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: width > 1100 ? '30%' : '45%', // 3 colonnes sur grand écran, 2 sur moyen
                  minWidth: 250,
                  backgroundColor: Colors.white,
                  borderRadius: 12,
                  padding: 24,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: '#EEE',
                }}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View style={{ 
                  backgroundColor: Colors.orangeVeryLight, 
                  alignSelf: 'flex-start', 
                  padding: 12, 
                  borderRadius: 12, 
                  marginBottom: 16 
                }}>
                  <Ionicons name={item.icon as any} size={28} color={Colors.orange} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: colors.text }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 14, color: 'gray', lineHeight: 20 }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

            {user && (
              <View style={{ marginTop: 60, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>{t('dangerZone')}</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <TouchableOpacity 
                      style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8 }} 
                      onPress={logout}
                    >
                      <Ionicons name="log-out-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
                      <Text style={{ color: colors.text, fontWeight: '600' }}>{t('logout')}</Text>
                  </TouchableOpacity>

                    <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FFCDCD', borderRadius: 8 }} 
                        onPress={handleDeleteAccount}
                      >
                        <Ionicons name="trash-outline" size={20} color="#D90429" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#D90429', fontWeight: '600' }}>{t('deleteAccountTitle')}</Text>
                    </TouchableOpacity>
                </View>
              </View>
            )}
        </ScrollView>
      </View>
    );
  }

  // --- VERSION MOBILE (inchangée) ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {router.canGoBack() && (
              <TouchableOpacity onPress={() => router.back()}> 
                <Ionicons name="chevron-back" size={32} color="#FF6B35" />
              </TouchableOpacity>
            )}
            <View style={styles.gearIcon}>
              <Ionicons name="settings-outline" size={32} color="#FF6B35" />
            </View>
          </View>
          
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}>
            <Text style={[styles.headerTitle, { fontSize: 18, color: colors.text }]}>
              {t('settings')}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
                key={index} 
                style={styles.menuButton} 
                onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={22} color="#FFF" />
              </View>
              <Text style={[styles.menuText, { fontSize: 16 }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {user && (
          <>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={24} color="#FFF" style={{marginRight: 10}} />
              <Text style={[styles.logoutText, { fontSize: 16 }]}>
                {t('logout')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Ionicons name="trash-outline" size={24} color="#FFF" style={{marginRight: 10}} />
              <Text style={[styles.logoutText, { fontSize: 16 }]}>
                {t('deleteAccountTitle')}
              </Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
      {!isWeb && 
        <View style={styles.bottomNavContainer}><BottomNavBar /></View>
      }
    </SafeAreaView>
  );
};

export default PageReglages;