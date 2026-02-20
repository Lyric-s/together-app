import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We use custom headers in pages or this is a sub-stack
        contentStyle: { backgroundColor: Colors.white },
      }}
    />
  );
}