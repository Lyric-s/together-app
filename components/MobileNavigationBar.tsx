import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { styles } from '@/styles/components/MobileNavigationBarStyles';
import {Colors} from "@/constants/colors";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { normalizePath } from '@/utils/path.utils';

/**
 * Type definition for a bottom navigation tab.
 *
 * @typedef TabItem
 * @property {string} id - Unique identifier for the tab.
 * @property {string} route - Route path associated with the tab.
 * @property {keyof typeof Ionicons.glyphMap} iconName - Icon displayed when the tab is active.
 * @property {keyof typeof Ionicons.glyphMap} iconOutline - Icon displayed when the tab is inactive.
 */
type TabItem = {
  id: string;
  route: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  label: string;
};

/**
 * BottomNavBar component.
 *
 * Displays a fixed bottom navigation bar with multiple tabs.
 * The active tab is automatically highlighted based on the current route.
 * Pressing a tab triggers navigation to the associated route.
 *
 * @component
 * @returns {JSX.Element} The rendered bottom navigation bar.
 */
const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userType } = useAuth();
  const { t } = useLanguage();

  const volunteerTabs: TabItem[] = [
    { id: 'home', route: '/(volunteer)/home', iconName: 'home', iconOutline: 'home-outline', label: t('home') },
    { id: 'search', route: '/(volunteer)/search', iconName: 'search', iconOutline: 'search-outline', label: t('search') },
    { id: 'library', route: '/(volunteer)/library', iconName: 'book', iconOutline: 'book-outline', label: t('library') },
    { id: 'profile', route: '/(volunteer)/profile', iconName: 'person', iconOutline: 'person-outline', label: t('profile') },
  ];

  const guestTabs: TabItem[] = [
    { id: 'home', route: '/(guest)/home', iconName: 'home', iconOutline: 'home-outline', label: t('home') },
    { id: 'search', route: '/(guest)/search', iconName: 'search', iconOutline: 'search-outline', label: t('search') },
    { id: 'library', route: '/(guest)/library', iconName: 'book', iconOutline: 'book-outline', label: t('library') },
    { id: 'profile', route: '/(guest)/profile', iconName: 'person', iconOutline: 'person-outline', label: t('profile') },
  ];

  const tabs = userType === 'volunteer' ? volunteerTabs : guestTabs;

  const isTabActive = (route: string, tabId: string) => {
    const cleanPathname = normalizePath(pathname);
    const cleanRoute = normalizePath(route);

    if (tabId === 'profile' && cleanPathname.startsWith('/settings')) {
        return true;
    }

    return cleanPathname === cleanRoute || cleanPathname.startsWith(`${cleanRoute}/`);
  };

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const routeString = typeof tab.route === 'string' ? tab.route : '';
        const isActive = isTabActive(routeString, tab.id);
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={ `Go to ${tab.id}`} 
            accessibilityState={{ selected: isActive }}
          >
            {isActive && <View style={styles.activeIndicator} />}

            <Ionicons
              name={isActive ? tab.iconName : tab.iconOutline}
              size={28}
              color={isActive ? Colors.brightOrange : Colors.black}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;
