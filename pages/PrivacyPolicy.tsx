import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { styles } from '@/styles/pages/PrivacyPoliceStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  // Récupération des outils de personnalisation
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();

  return (
    // Application du fond d'écran du thème
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}> 
              <Ionicons name="chevron-back" size={32} color="#FF6B35" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gearIcon}>
              <Ionicons name="settings-outline" size={32} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}>
            <Text style={[
                styles.headerTitle, 
                { fontSize: getFontSize(18), fontFamily: fontFamily, color: colors.text }
            ]}>
              {t('settings')}
            </Text>
          </View>
        </View>

        <Text style={[
            styles.pageTitle, 
            { fontSize: getFontSize(22), fontFamily: fontFamily, color: colors.text }
        ]}>
          {t('privacyPageTitle')}
        </Text>

        {/* CONTENU TRADUIT ET DYNAMIQUE */}
        <View style={styles.contentContainer}>
          <Text style={[
              styles.paragraph, 
              { 
                fontSize: getFontSize(14), 
                fontStyle: 'italic', 
                marginBottom: 20, 
                fontFamily: fontFamily, 
                color: colors.text 
              }
          ]}>
            {t('lastUpdate')}
          </Text>

          {/* Section 1 */}
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), fontFamily: fontFamily }]}>
            {t('priv1Title')}
          </Text>
          <Text style={[styles.paragraph, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>
            {t('priv1Text')}
          </Text>

          {/* Section 2 */}
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), fontFamily: fontFamily }]}>
            {t('priv2Title')}
          </Text>
          <Text style={[styles.paragraph, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>
            {t('priv2Text')}
          </Text>

          {/* Section 3 */}
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), fontFamily: fontFamily }]}>
            {t('priv3Title')}
          </Text>
          <Text style={[styles.paragraph, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>
            {t('priv3Text')}
          </Text>

          {/* Section 4 */}
          <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), fontFamily: fontFamily }]}>
            {t('priv4Title')}
          </Text>
          <Text style={[styles.paragraph, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>
            {t('priv4Text')}
          </Text>
        </View>

      </ScrollView>
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;