import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Linking, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@/styles/pages/ContactStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

const Contact = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 40 }}>
        <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-back" size={24} color="#FF6B35" />
                <Text style={{ marginLeft: 10, fontSize: 16, color: "#FF6B35", fontWeight: '600' }}>{t('backToSettings')}</Text>
            </TouchableOpacity>
        </View>
        
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>
            {t('contactPageTitle')}
            </Text>
        <Text style={{ fontSize: 18, color: colors.text, textAlign: 'center', maxWidth: 600, marginBottom: 40 }}>
          {t('contactDesc')}
        </Text>

        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: colors.card, 
            padding: 30, 
            borderRadius: 12, 
            borderWidth: 1, 
            borderColor: colors.border,
            gap: 20,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5
          }} 
          onPress={() => Linking.openURL('mailto:contact@together-app.com')}
        >
            <View style={{ padding: 15, backgroundColor: Colors.orangeVeryLight, borderRadius: 50 }}>
               <Ionicons name="mail" size={32} color="#FF6B35" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: 'gray' }}>{t('emailLabel')}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>contact@together-app.com</Text>
            </View>
        </TouchableOpacity>
      </View>
    </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={32} color="#FF6B35" /></TouchableOpacity></View>
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}><Text style={[styles.headerTitle, { fontSize: 18, color: colors.text }]}>{t('settings')}</Text></View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.iconCircle}><Ionicons name="chatbubbles-outline" size={50} color="#FF6B35" /></View>
          <Text style={[styles.pageTitle, { fontSize: 22, color: colors.text }]}>{t('contactPageTitle')}</Text>
          <Text style={[styles.description, { fontSize: 15, color: colors.text }]}>{t('contactDesc')}</Text>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => Linking.openURL('mailto:contact@together-app.com')}>
            <Ionicons name="mail" size={28} color="#FF6B35" />
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { fontSize: 12, color: colors.text }]}>{t('emailLabel')}</Text>
              <Text style={[styles.contactValue, { fontSize: 16, color: colors.text }]}>contact@together-app.com</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavContainer}><BottomNavBar /></View>
    </SafeAreaView>
  );
};

export default Contact;