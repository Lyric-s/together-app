/**
 * @file _layout.tsx (VOLUNTEER)
 * @description Specific layout for the Volunteer area (Web Only).
 */

import { Href, Redirect, Stack, router } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import BottomNavBar from '@/components/MobileNavigationBar';
import Sidebar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Volunteer area layout that enforces volunteer-only access and renders platform-specific navigation.
 *
 * Shows a full-screen loading indicator while authentication state is loading. If the authenticated user's
 * type is not "volunteer", redirects to the guest home route (`/(guest)/home`). Otherwise renders the main
 * volunteer layout: on web a persistent Sidebar (with the volunteer's display name) alongside a Stack for
 * the "home" and "profile" screens; on non-web platforms a vertical layout with a BottomNavBar.
 *
 * @returns The rendered JSX element: either the loading indicator, a redirect to `/(guest)/home`, or the volunteer layout containing sidebar, stack, and/or bottom navigation.
 */
export default function VolunteerLayout() {
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

  if (userType !== 'volunteer') {
    return <Redirect href="/(guest)/home" />;
  }

  return (
    <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
      {isWeb && (
        <Sidebar 
          userType="volunteer" 
          userName={
             (user?.first_name && user?.last_name)
            ? `${user.first_name} ${user.last_name}`
            : user?.username || t('defaultVolunteer')
        }
          onNavigate={(route) => {
             router.push(route as Href);
          }} 
        />
      )}

      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home/index" />
          <Stack.Screen name="profile/index" />
        </Stack>
      </View>

      {!isWeb && (
        <BottomNavBar />
      )}
      
    </View>
  );
}