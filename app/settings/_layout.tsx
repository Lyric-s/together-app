import { Stack, useRouter, Href } from 'expo-router';
import { Platform, View } from 'react-native';
import Sidebar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

export default function SettingsLayout() {
  const isWeb = Platform.OS === 'web';
  const { user, userType } = useAuth();
  const router = useRouter();

  if (isWeb) {
      const sidebarUserType = userType || 'volunteer_guest';
      const sidebarUserName = user 
        ? (user.company_name || user.first_name || user.username || 'Utilisateur') 
        : 'Invité';

      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
           <Sidebar 
             userType={sidebarUserType as any} 
             userName={sidebarUserName}
             onNavigate={(route) => {
                 router.push(route as Href);
             }}
           />
           <View style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
             <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.white } }} />
           </View>
        </View>
      );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.white },
      }}
    />
  );
}