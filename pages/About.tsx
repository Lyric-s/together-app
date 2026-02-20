import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { styles } from '@/styles/pages/AboutStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const About = () => {
  const navigation = useNavigation();
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();

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
                { fontSize: getFontSize(18), fontFamily: fontFamily, color: colors.text }
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
              { fontSize: getFontSize(28), fontFamily: fontFamily, color: "#FF6B35" } // On garde l'orange pour la marque
          ]}>
            Together
          </Text>
          <Text style={[
              styles.versionText, 
              { fontSize: getFontSize(14), fontFamily: fontFamily, color: "#999" }
          ]}>
            {t('version')}
          </Text>

          <Text style={[
              styles.sectionTitle, 
              { fontSize: getFontSize(18), fontFamily: fontFamily, color: colors.text }
          ]}>
            {t('missionTitle')}
          </Text>
          <Text style={[
              styles.paragraph, 
              { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }
          ]}>
            {t('missionText')}
          </Text>

          <Text style={[
            styles.paragraph, 
            { 
                marginTop: 30, 
                textAlign: 'center', 
                fontSize: getFontSize(12), 
                color: '#999',
                fontFamily: fontFamily
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