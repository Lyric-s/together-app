import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@/styles/pages/NotificationsStyle';
import BottomNavBar from '@/components/MobileNavigationBar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { t, getFontSize, fontFamily } = useLanguage();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  const [news, setNews] = useState(true);
  const [data, setData] = useState(true);
  const [offers, setOffers] = useState(true);

  const RadioRow = ({ selected, onSelect }: { selected: boolean, onSelect: (val: boolean) => void }) => (
    <View style={styles.radioGroup}>
      <TouchableOpacity style={styles.radioOption} onPress={() => onSelect(true)}>
        <View style={[styles.radioCircle, selected ? styles.radioSelected : styles.radioUnselected]} />
        <Text style={[styles.radioLabel, { fontSize: getFontSize(15), fontFamily: fontFamily, color: colors.text }]}>{t('accept')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.radioOption} onPress={() => onSelect(false)}>
        <View style={[styles.radioCircle, !selected ? styles.radioSelected : styles.radioUnselected]} />
        <Text style={[styles.radioLabel, { fontSize: getFontSize(15), fontFamily: fontFamily, color: colors.text }]}>{t('refuse')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 40 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.orange} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: Colors.orange, fontFamily, fontWeight: '600' }}>{t('backToSettings')}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: colors.text, fontFamily }}>
          {t('notifPageTitle')}
        </Text>

        <View style={{ maxWidth: 800, gap: 30 }}>
            <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 16, marginBottom: 15, fontFamily, color: colors.text }}>{t('notifNewsDesc')}</Text>
                <RadioRow selected={news} onSelect={setNews} />
            </View>

            <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 16, marginBottom: 15, fontFamily, color: colors.text }}>{t('notifDataDesc')}</Text>
                <RadioRow selected={data} onSelect={setData} />
            </View>

            <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 16, marginBottom: 15, fontFamily, color: colors.text }}>{t('notifOffersDesc')}</Text>
                <RadioRow selected={offers} onSelect={setOffers} />
            </View>

            <TouchableOpacity style={[styles.validateButton, { alignSelf: 'flex-start', paddingHorizontal: 40 }]}>
                <Text style={[styles.validateButtonText, { fontSize: getFontSize(16), fontFamily: fontFamily }]}>{t('validate')}</Text>
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
          <View style={[styles.headerTitleContainer, { backgroundColor: colors.headerBackground }]}><Text style={[styles.headerTitle, { fontSize: getFontSize(18), color: colors.text }]}>{t('settings')}</Text></View>
        </View>

        <Text style={[styles.pageTitle, { fontSize: getFontSize(24), fontFamily: fontFamily, color: colors.text }]}>{t('notifPageTitle')}</Text>

        <View style={styles.section}>
          <Text style={[styles.description, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>{t('notifNewsDesc')}</Text>
          <RadioRow selected={news} onSelect={setNews} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.description, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>{t('notifDataDesc')}</Text>
          <RadioRow selected={data} onSelect={setData} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.description, { fontSize: getFontSize(14), fontFamily: fontFamily, color: colors.text }]}>{t('notifOffersDesc')}</Text>
          <RadioRow selected={offers} onSelect={setOffers} />
        </View>

        <View style={styles.validateButtonContainer}>
          <TouchableOpacity style={styles.validateButton}><Text style={[styles.validateButtonText, { fontSize: getFontSize(16), fontFamily: fontFamily }]}>{t('validate')}</Text></TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavContainer}><BottomNavBar /></View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;