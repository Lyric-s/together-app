import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/LanguageAccessibilityStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const LanguageAccessibility = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t, textSize, setTextSize, fontType, setFontType } = useLanguage();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  const handleTextSizeChange = (increment: number) => {
    const newSize = textSize + increment;
    if (newSize >= 1 && newSize <= 5) setTextSize(newSize);
  };

  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 40 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.orange} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: Colors.orange, fontWeight: '600' }}>{t('backToSettings')}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: colors.text }}>
          {t('languageAccessibility')}
        </Text>

        <View style={{ maxWidth: 600, alignSelf: 'center', width: '100%', gap: 30 }}>
            {/* Langue */}
            <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>{t('language')}</Text>
                <View style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, backgroundColor: colors.card }}>
                    <Picker selectedValue={language} onValueChange={(v) => setLanguage(v)} style={{ height: 50, color: colors.text, width: '100%' }}>
                        <Picker.Item label="Français" value="fr" />
                        <Picker.Item label="English" value="en" />
                    </Picker>
                </View>
            </View>

            {/* Taille texte */}
            <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>{t('textSize')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' }}>
                    <TouchableOpacity onPress={() => handleTextSizeChange(-1)}>
                        <Ionicons name="remove-circle-outline" size={32} color="#FF6B35" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((level) => (
                            <View key={level} style={{ height: 8, flex: 1, backgroundColor: level <= textSize ? '#FF6B35' : '#E0E0E0', borderRadius: 4 }} />
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => handleTextSizeChange(1)}>
                        <Ionicons name="add-circle-outline" size={32} color="#FF6B35" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Police */}
            <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>{t('font')}</Text>
                <View style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, backgroundColor: colors.card }}>
                    <Picker selectedValue={fontType} onValueChange={(v) => setFontType(v)} style={{ height: 50, color: colors.text, width: '100%' }}>
                        <Picker.Item label={t('defaultFont')} value="default" />
                        <Picker.Item label="OpenDyslexic" value="opendyslexic" />
                    </Picker>
                </View>
            </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}> 
              <Ionicons name="chevron-back" size={32} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}>
            <Text style={[styles.headerTitle, { fontSize: 18, color: colors.text }]}>
              {t('settings')}
            </Text>
          </View>
        </View>

        <Text style={[styles.pageTitle, { fontSize: 20, color: colors.text, marginBottom: 30 }]}>
          {t('languageAccessibility')}
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { fontSize: 16, color: colors.text }]}>{t('language')} :</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Picker selectedValue={language} onValueChange={(v) => setLanguage(v)} style={{ color: colors.text }} dropdownIconColor={colors.text}>
                <Picker.Item label="Français" value="fr" /><Picker.Item label="English" value="en" />
              </Picker>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { fontSize: 16, color: colors.text }]}>{t('textSize')} :</Text>
            <View style={styles.textSizeContainer}>
              <TouchableOpacity onPress={() => handleTextSizeChange(-1)}><Ionicons name="remove-circle-outline" size={35} color="#FF6B35" /></TouchableOpacity>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                {[1, 2, 3, 4, 5].map((level) => (<View key={level} style={{ height: 6, flex: 1, backgroundColor: level <= textSize ? '#FF6B35' : '#E0E0E0', borderRadius: 3 }} />))}
              </View>
              <TouchableOpacity onPress={() => handleTextSizeChange(1)}><Ionicons name="add-circle-outline" size={35} color="#FF6B35" /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { fontSize: 16, color: colors.text }]}>{t('font')} :</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Picker selectedValue={fontType} onValueChange={(v) => setFontType(v)} style={{ color: colors.text }} dropdownIconColor={colors.text}>
                <Picker.Item label={t('defaultFont')} value="default" /><Picker.Item label="OpenDyslexic" value="opendyslexic" />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomNavContainer}><BottomNavBar /></View>
    </SafeAreaView>
  );
};

export default LanguageAccessibility;