import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { styles } from '@/styles/pages/AboutStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const About = () => {
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
            <Image 
                source={require('../assets/images/logo.png')} 
                style={{ width: 120, height: 120, marginBottom: 20 }}
                resizeMode="contain"
            />
            
            <Text style={{ fontSize: 36, color: "#FF6B35", fontWeight: 'bold', marginBottom: 10 }}>
            Together
        </Text>
        <Text style={{ fontSize: 16, color: "#999", marginBottom: 40 }}>
            {t('version')}
        </Text>

        <View style={{ maxWidth: 600 }}>
            <Text style={{ fontSize: 24, color: colors.text, marginBottom: 16, fontWeight: '600' }}>
            {t('missionTitle')}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text, textAlign: 'justify' }}>
            {t('missionText')}
            </Text>
        </View>
        <Text style={{ marginTop: 60, fontSize: 14, color: '#999' }}>
            {t('copyright')}
        </Text>
        </View>
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

        {/* CONTENU */}
        <View style={styles.infoContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
          />
          
          <Text style={[
              styles.appName, 
              { fontSize: 28, color: "#FF6B35" } // On garde l'orange pour la marque
          ]}>
            Together
          </Text>
          <Text style={[
              styles.versionText, 
              { fontSize: 14, color: "#999" }
          ]}>
            {t('version')}
          </Text>

          <Text style={[
              styles.sectionTitle, 
              { fontSize: 18, color: colors.text }
          ]}>
            {t('missionTitle')}
          </Text>
          <Text style={[
              styles.paragraph, 
              { fontSize: 14, color: colors.text }
          ]}>
            {t('missionText')}
          </Text>

          <Text style={[
            styles.paragraph, 
            { 
                marginTop: 30, 
                textAlign: 'center', 
                fontSize: 12, 
                color: '#999',
            }
          ]}>
            {t('copyright')}
          </Text>
        </View>

      </ScrollView>
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default About;