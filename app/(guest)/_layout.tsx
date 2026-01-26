/**
 * @file _layout.tsx (GUEST)
 * @description Specific layout for the GUEST area (Web & Mobile).
 */

import { Href, Redirect, Stack, router } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import BottomNavBar from '@/components/MobileNavigationBar';
import Sidebar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Renders the guest layout and adapts presentation for web and mobile.
 *
 * While authentication is loading, displays a centered loading indicator. After loading,
 * shows the main content stack; on web also renders a Sidebar with guest user info, on
 * mobile also renders a BottomNavBar.
 *
 * @returns The React element for the guest layout.
 */
export default function GuestLayout() {
  const { user, isLoading } = useAuth();
  const isWeb = Platform.OS === 'web';
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
      {isWeb && (
        <Sidebar 
          userType="volunteer_guest" 
          userName={user?.username || t('defaultGuest')} 
          onNavigate={(route) => {
             router.push(route as Href);
          }} 
        />
      )}

      <View style={{ flex: 1 }}>
        <Stack screenOptions={{
          headerShown: false,
          animation: 'fade', 
          animationDuration: 200,
        }}>
          <Stack.Screen name="home/index" />
          <Stack.Screen name="search/index" />
          <Stack.Screen name="search/mission/[id]" />
          <Stack.Screen name="search/association/[id]" />
          <Stack.Screen name="library/index" />
          <Stack.Screen name="profile/index" />
        </Stack>
      </View>

      {!isWeb && (
        <BottomNavBar />
      )}
      
    </View>
  );
}