import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@/styles/pages/ContactStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const Contact = () => {
  const navigation = useNavigation();
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={32} color="#FF6B35" /></TouchableOpacity></View>
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}><Text style={[styles.headerTitle, { fontSize: getFontSize(18), color: colors.text }]}>{t('settings')}</Text></View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.iconCircle}><Ionicons name="chatbubbles-outline" size={50} color="#FF6B35" /></View>
          <Text style={[styles.pageTitle, { fontSize: getFontSize(22), fontFamily: fontFamily, color: colors.text }]}>{t('contactPageTitle')}</Text>
          <Text style={[styles.description, { fontSize: getFontSize(15), fontFamily: fontFamily, color: colors.text }]}>{t('contactDesc')}</Text>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => Linking.openURL('mailto:contact@together-app.com')}>
            <Ionicons name="mail" size={28} color="#FF6B35" />
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { fontSize: getFontSize(12), fontFamily: fontFamily, color: colors.text }]}>{t('emailLabel')}</Text>
              <Text style={[styles.contactValue, { fontSize: getFontSize(16), fontFamily: fontFamily, color: colors.text }]}>contact@together-app.com</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavContainer}><BottomNavBar /></View>
    </SafeAreaView>
  );
};

export default Contact;