import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/TermsConditionStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const TermsConditions = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 40 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.orange} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: Colors.orange, fontWeight: '600' }}>{t('backToSettings')}</Text>
        </TouchableOpacity>
        
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: colors.text }}>
          {t('termsTitle')}
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 16, fontStyle: 'italic', marginBottom: 20, color: colors.text }}>
            {t('lastUpdate')}
          </Text>

          <View style={{ gap: 24, paddingBottom: 50 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: colors.text }}>{t('terms1Title')}</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{t('terms1Text')}</Text>
            </View>
             <View>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: colors.text }}>{t('terms2Title')}</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{t('terms2Text')}</Text>
            </View>
             <View>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: colors.text }}>{t('terms3Title')}</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{t('terms3Text')}</Text>
            </View>
             <View>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: colors.text }}>{t('terms4Title')}</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{t('terms4Text')}</Text>
            </View>
             <View>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: colors.text }}>{t('terms5Title')}</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{t('terms5Text')}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
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
                { fontSize: 18, color: colors.text }
            ]}>
              {t('settings')}
            </Text>
          </View>
        </View>

        <Text style={[
            styles.pageTitle, 
            { fontSize: 22, color: colors.text }
        ]}>
          {t('termsTitle')}
        </Text>

        {/* CONTENU */}
        <View style={styles.contentContainer}>
          <Text style={[
              styles.paragraph, 
              { fontSize: 14, fontStyle: 'italic', marginBottom: 20, color: colors.text }
          ]}>
            {t('lastUpdate')}
          </Text>

          {/* Section 1 */}
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{t('terms1Title')}</Text>
          <Text style={[styles.paragraph, { fontSize: 14, color: colors.text }]}>{t('terms1Text')}</Text>

          {/* Section 2 */}
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{t('terms2Title')}</Text>
          <Text style={[styles.paragraph, { fontSize: 14, color: colors.text }]}>{t('terms2Text')}</Text>

          {/* Section 3 */}
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{t('terms3Title')}</Text>
          <Text style={[styles.paragraph, { fontSize: 14, color: colors.text }]}>{t('terms3Text')}</Text>

          {/* Section 4 */}
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{t('terms4Title')}</Text>
          <Text style={[styles.paragraph, { fontSize: 14, color: colors.text }]}>{t('terms4Text')}</Text>

          {/* Section 5 */}
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{t('terms5Title')}</Text>
          <Text style={[styles.paragraph, { fontSize: 14, color: colors.text }]}>{t('terms5Text')}</Text>
        </View>

      </ScrollView>
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default TermsConditions;