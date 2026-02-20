import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { styles } from '@/styles/pages/PrivacySecurityStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const PrivacySecurity = () => {
  const navigation = useNavigation();
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('error'), t('pwdErrorEmpty'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('error'), t('pwdErrorMatch'));
      return;
    }
    Alert.alert(t('success'), t('pwdSuccessMsg'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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

        <Text style={[
            styles.pageTitle, 
            { fontSize: getFontSize(20), fontFamily: fontFamily, color: colors.text }
        ]}>
          {t('securityTitle')}
        </Text>

        {/* SECTION FORMULAIRE */}
        <View style={styles.formSection}>
          <Text style={[
              styles.sectionTitle, 
              { fontSize: getFontSize(18), fontFamily: fontFamily }
          ]}>
            {t('accountSecurity')}
          </Text>
          
          {/* Champ 1 */}
          <View style={styles.inputGroup}>
            <Text style={[
                styles.label, 
                { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }
            ]}>
                {t('currentPwd')}
            </Text>
            <TextInput
              style={[
                  styles.input, 
                  { 
                    fontSize: getFontSize(14), 
                    fontFamily: fontFamily, 
                    backgroundColor: colors.card, // Fond adapté au thème
                    color: colors.text,           // Texte adapté au thème
                    borderColor: colors.border    // Bordure adaptée
                  }
              ]}
              placeholder={t('currentPwdPlace')}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ 2 */}
          <View style={styles.inputGroup}>
            <Text style={[
                styles.label, 
                { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }
            ]}>
                {t('newPwd')}
            </Text>
            <TextInput
              style={[
                  styles.input, 
                  { 
                    fontSize: getFontSize(14), 
                    fontFamily: fontFamily, 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border
                  }
              ]}
              placeholder={t('newPwdPlace')}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ 3 */}
          <View style={styles.inputGroup}>
            <Text style={[
                styles.label, 
                { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }
            ]}>
                {t('confirmPwd')}
            </Text>
            <TextInput
              style={[
                  styles.input, 
                  { 
                    fontSize: getFontSize(14), 
                    fontFamily: fontFamily, 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border
                  }
              ]}
              placeholder={t('confirmPwdPlace')}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
            <Text style={[
                styles.saveButtonText, 
                { fontSize: getFontSize(16), fontFamily: fontFamily }
            ]}>
              {t('updatePwdBtn')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ZONE DE DANGER */}
        <View style={[styles.dangerZone, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#D32F2F" />
            <Text style={[
                styles.deleteText, 
                { fontSize: getFontSize(16), fontFamily: fontFamily }
            ]}>
              {t('deleteAccount')}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default PrivacySecurity;