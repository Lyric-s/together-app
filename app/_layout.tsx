import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';
import { StatusBar, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';

function RootLayoutNav() {
  const { userType, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    const inProtectedRoute = ['(volunteer)', '(association)', '(admin)'].includes(segments[0]);

    if (userType !== 'volunteer_guest' && inAuthGroup) {
      const targetHome = userType === 'admin' ? 'dashboard' : 'home';
      router.replace(`/(${userType})/${targetHome}` as any);
    } 
    else if (userType === 'volunteer_guest' && inProtectedRoute) {
      router.replace('/(guest)/home' as any);
    }
  }, [userType, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(guest)" />
        <Stack.Screen name="(volunteer)" />
        <Stack.Screen name="(association)" />
        <Stack.Screen name="(admin)" />
      </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? Colors.black : Colors.white;

  const customDarkTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: Colors.black, card: Colors.black },
  };
  const customLightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: Colors.white, card: Colors.white },
  };

  return (
    <AuthProvider>
      <AppThemeProvider>
        <LanguageProvider>
          <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
            <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'bottom']}>
              <RootLayoutNav />
              <StatusBar 
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
                backgroundColor={backgroundColor}
              />
            </SafeAreaView>
          </ThemeProvider>
        </LanguageProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});