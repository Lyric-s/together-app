/**
 * @file ActivityGuest.tsx
 * @description Mobile screen displayed when the user is not authenticated.
 * Encourages the user to log in or create an account to access their activity.
 */

import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ButtonAuth from '@/components/Button';
import { styles } from '@/styles/pages/ActivityGuestStyles';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Renders a screen prompting unauthenticated users to log in or create an account.
 *
 * Displays two calls-to-action that navigate to the login and registration screens.
 *
 * @returns The component view for the unauthenticated activity screen.
 */
export default function ActivityGuest() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={{ position: 'absolute', top: 10, right: 20, zIndex: 10 }}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings-outline" size={28} color={Colors.orange} />
      </TouchableOpacity>

      <Text style={styles.mainText}>
        {t('guestActivityMsg')}
      </Text>

      <ButtonAuth
        text={t('loginBtn')}
        onPress={() => router.push('/(auth)/login')}
      />

      <Text style={styles.mainText}>
        {t('guestCreateAccountMsg')}
      </Text>

      <ButtonAuth
        text={t('registerBtn')}
        onPress={() => router.push('/(auth)/register')}
      />
    </View>
  );
}