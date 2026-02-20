/**
 * @file _layout.tsx (ADMIN)
 * @description Specific layout for the Administrator area (Web Only).
 */

import { Href, Redirect, Stack, router } from 'expo-router';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import Sidebar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

/**
 * Render the web-only administrator layout with access control and a sidebar for navigation.
 *
 * The component displays:
 * - a centered loading indicator while authentication state is resolving;
 * - a French message preventing access from non-web platforms;
 * - a redirect to the admin login when the current user is not an admin;
 * - the admin two-pane layout (Sidebar and main content Stack) for authorized web users.
 *
 * @returns A React element representing the appropriate UI for the current auth and platform state.
 */
export default function AdminLayout() {
  const { user, isLoading, userType } = useAuth();
  const isWeb = Platform.OS === 'web';

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
          L'espace administrateur n'est pas disponible sur mobile.
          Veuillez utiliser un ordinateur.
        </Text>
      </View>
    );
  }

  if (userType !== 'admin') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', height: '100%' }}>
        <Sidebar 
            userType="admin" 
            userName={user?.username || 'Admin'} 
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