import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
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

const PageReglages = () => { 
  const router = useRouter(); 
  const { logout, user } = useAuth(); 
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  const menuItems = [
    { title: 'Notifications', icon: 'notifications-outline', route: '/settings/notifications' },
    { title: 'Langue et Accessibilité', icon: 'language-outline', route: '/settings/language' },
    { title: 'Contacts', icon: 'call-outline', route: '/settings/contact' },
    { title: 'Termes & Conditions', icon: 'document-text-outline', route: '/settings/terms' },
    { title: 'Politique de confidentialité', icon: 'shield-checkmark-outline', route: '/settings/privacy' },
    { title: 'À propos', icon: 'information-circle-outline', route: '/settings/about' },
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: async () => {
            if (!user) {
                Alert.alert("Erreur", "Utilisateur non identifié.");
                return;
            }

            try {
              if (user.user_type === UserType.VOLUNTEER && user.id_volunteer) {
                  await volunteerService.deleteProfile(user.id_volunteer);
              } else if (user.user_type === UserType.ASSOCIATION && user.id_association) {
                  await associationService.delete(user.id_association);
              } else {
                  Alert.alert("Erreur", "Type d'utilisateur non supporté pour la suppression automatique.");
                  return;
              }

              Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
              logout(); 
            } catch (error) {
              console.error("Erreur de suppression du compte:", error);
              Alert.alert("Erreur", "Impossible de supprimer le compte pour le moment.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

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
            <Text style={[styles.headerTitle, { fontSize: getFontSize(18), color: colors.text, fontFamily }]}>
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
              <Text style={[styles.menuText, { fontSize: getFontSize(16), fontFamily: fontFamily }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" style={{marginRight: 10}} />
          <Text style={[styles.logoutText, { fontSize: getFontSize(16), fontFamily: fontFamily }]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>

        {user?.user_type !== UserType.ADMIN && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={24} color="#FFF" style={{marginRight: 10}} />
            <Text style={[styles.logoutText, { fontSize: getFontSize(16), fontFamily: fontFamily }]}>
                Supprimer mon compte
            </Text>
            </TouchableOpacity>
        )}

      </ScrollView>
      {!isWeb && 
        <View style={styles.bottomNavContainer}><BottomNavBar /></View>
      }
    </SafeAreaView>
  );
};

export default PageReglages;