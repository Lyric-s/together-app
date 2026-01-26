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
 * Layout component for the Volunteer area that enforces access control and provides platform-specific navigation.
 *
 * Renders a full-screen loading indicator while authentication is loading, redirects to the login route if the
 * authenticated user's type is not "volunteer", and otherwise renders the main layout: a persistent Sidebar on web,
 * a Stack containing the volunteer "home" and "profile" screens, and a BottomNavBar on non-web platforms.
 *
 * @returns The component's rendered JSX element: either the loading indicator, a redirect to login, or the volunteer layout with sidebar/stack/bottom navigation.
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