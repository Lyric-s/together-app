/**
 * @file _layout.tsx (ASSOCIATION)
 * @description Specific layout for the Association area (Web Only).
 */

import { Href, Redirect, Stack, router } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ThemedText';
import Sidebar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Platform-specific layout for the Association area that gates access based on authentication and device.
 *
 * Shows a centered loading indicator while authentication state is loading. On non-web platforms, displays
 * a centered message indicating the Association area is unavailable on mobile. If the authenticated user's
 * type is not `"association"`, redirects to the login route. Otherwise, renders the web two-column layout
 * with an association Sidebar and a content Stack.
 *
 * @returns A JSX element representing the association layout (loader, mobile message, redirect, or web two-column view).
 */
export default function AssociationLayout() {
  const { user, isLoading, userType } = useAuth();
  const isWeb = Platform.OS === 'web';
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  if (!isWeb) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          {t('mobileNotAvailable')}
        </Text>
      </View>
    );
  }

  if (userType !== 'association') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', height: '100%' }}>
        <Sidebar 
            userType="association" 
            userName={user?.company_name || 'Association'} 
            onNavigate={(route) => {
                router.push(route as Href);
            }} 
        />

      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}