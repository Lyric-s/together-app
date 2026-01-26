import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import ProfilePicture from "./ProfilPicture";
import { getStyles } from "../styles/components/SideBarStyle";
import { usePathname, Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizePath } from '@/utils/path.utils';

const MOBILE_BREAKPOINT = 900;

type SidebarProps = {
  userType: "volunteer" | "volunteer_guest" | "association" | "admin";
  userName: string;
  onNavigate: (route: Href | string) => void;
};

const resolvePath = (route: Href | string): string => {
  if (typeof route === 'string') return route;
  if (typeof route === 'object' && route !== null && 'pathname' in route) {
    return route.pathname;
  }
  return '';
};

type MenuItem = {
    icon: any;
    label: string;
    route: Href; 
};

type SidebarButtonProps = {
  icon: any;
  label: string;
  onPress: () => void;
  active?: boolean;
};

/**
 * Render a sidebar menu button containing an icon and a label.
 *
 * @param icon - Image source used for the button icon
 * @param label - Text displayed next to the icon
 * @param onPress - Callback invoked when the button is pressed
 * @param active - When `true`, applies active styling to indicate selection
 * @returns A React element representing the touchable sidebar button
 */
function SidebarButton({ icon, label, onPress, active=false }:SidebarButtonProps) {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, active && styles.activeButton]}
    >
      <Image source={icon} style={styles.buttonIcon} />
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/**
 * Sidebar component for web and responsive layouts.
 *
 * @param userType - Type of the user ("volunteer", "volunteer_guest", "association", "admin")
 * @param userName - Display name of the user or association
 * @param onNavigate - Callback to navigate when a button is clicked; receives the route string
 *
 * Responsive behavior:
 * - On large screens (desktop), the sidebar is permanently visible and occupies a fixed space
 *   on the left side of the layout.
 * - On small screens, the sidebar is hidden by default and replaced by a burger menu button.
 * - The burger button toggles the visibility of the sidebar.
 * - When opened on small screens, the sidebar appears as an overlay (absolute positioned)
 *   and does NOT push or resize the main content.
 * - Selecting a navigation item on small screens automatically closes the sidebar.
 *
 * Displays:
 * - App title based on user type
 * - Profile picture and user name
 * - Two sections: GENERAL (main navigation) and SECURITE (logout/settings)
 * - Buttons highlight in bright orange when active
 * - Scrollable content when menu height exceeds viewport
 */
export default function Sidebar({ userType, userName, onNavigate }: SidebarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const styles = getStyles(width);
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const [open, setOpen] = React.useState(!isMobile);

  // Resize
  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const appTitle =
    userType === "association"
      ? t('togetherAssos')
      : userType === "admin"
      ? t('togetherMgmt')
      : "Together";

  const sections: Record<string, MenuItem[]> = {
    volunteer: [
      { icon: require("../assets/images/home.png"), label: t('home'), route: "/(volunteer)/home" },
      { icon: require("../assets/images/search.png"), label: t('search'), route: "/(volunteer)/search" },
      { icon: require("../assets/images/upcoming.png"), label: t('upcomingMissions'), route: "/(volunteer)/library/upcoming" },
      { icon: require("../assets/images/historical.png"), label: t('history'), route: "/(volunteer)/library/history" },
      { icon: require("../assets/images/user.png"), label: t('profile'), route: "/(volunteer)/profile" },
    ],
    volunteer_guest: [
      { icon: require("../assets/images/home.png"), label: t('home'), route: "/(guest)/home" },
      { icon: require("../assets/images/search.png"), label: t('search'), route: "/(guest)/search" },
    ],
    association: [
      { icon: require("../assets/images/home.png"), label: t('home'), route: "/(association)/home" },
      { icon: require("../assets/images/plus.png"), label: t('createMission'), route: "/(association)/mission_creation" },
      { icon: require("../assets/images/upcoming.png"), label: t('upcomingMissions'), route: "/(association)/library/upcoming" },
      { icon: require("../assets/images/historical.png"), label: t('history'), route: "/(association)/library/history" },
      { icon: require("../assets/images/user.png"), label: t('profile'), route: "/(association)/profile" },
    ],
    admin: [
      { icon: require("../assets/images/dashboard.png"), label: t('dashboard'), route: "/(admin)/dashboard" },
      { icon: require("../assets/images/search.png"), label: t('search'), route: "/(admin)/search" },
      { icon: require("../assets/images/report.png"), label: t('report'), route: "/(admin)/report" },
      { icon: require("../assets/images/user.png"), label: t('profile'), route: "/(admin)/profile" },
    ],
  };
  
  let activeSection = sections.volunteer_guest;
  if (userType === 'volunteer') activeSection = sections.volunteer;
  else if (userType === 'association') activeSection = sections.association;
  else if (userType === 'admin') activeSection = sections.admin;

  const securityItemsConnected = [
    { icon: require("../assets/images/logout.png"), label: t('logout'), route: "LOGOUT_ACTION" },
    { icon: require("../assets/images/settings.png"), label: t('settings'), route: "/settings" },
  ];

  const securityItemsGuest = [
    { icon: require("../assets/images/login.png"), label: t('login'), route: "/(auth)/login" },
    { icon: require("../assets/images/settings.png"), label: t('settings'), route: "/settings" },
  ];

  const securityItems = userType === 'volunteer_guest' 
    ? securityItemsGuest 
    : securityItemsConnected;

  const handleNavigation = (route: Href | string) => {
    if (route === "LOGOUT_ACTION") {
      logout();
      return;
    }
    onNavigate(route as Href);
    if (isMobile) setOpen(false);
  };

  const isRouteActive = (route: Href | string) => {
    if (route === "LOGOUT_ACTION") return false;
    const routePath = resolvePath(route);
    const cleanPathname = normalizePath(pathname);
    const cleanRoute = normalizePath(routePath);

    if (cleanPathname === cleanRoute) return true;
    return cleanPathname.startsWith(`${cleanRoute}/`);
  };

  return (
    <>
      {/* BURGER BUTTON */}
      {isMobile && (
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={styles.burgerButton}
          accessibilityRole="button"
          accessibilityLabel={open ? t('menuClose') : t('menuOpen')}
        >
          <Text style={styles.burger}>☰</Text>
        </TouchableOpacity>      )}

      {/* SIDEBAR */}
      {open && (
        <View
          style={[
            styles.sidebar,
            isMobile && styles.reducedSideBar,
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View>
              <View style={styles.titleRow}>
                <Image
                  source={require("../assets/images/logo.png")}
                  style={styles.logo}
                />
                <Text style={styles.title}>{appTitle}</Text>
              </View>

              {/* PROFIL */}
              <View style={styles.profileRow}>
                <ProfilePicture
                  source={require("../assets/images/favicon.png")}
                  size={45}
                />
                <Text style={styles.userName}>{userName}</Text>
              </View>

              <Text style={styles.sectionTitle}>{t('general')}</Text>
              {activeSection.map((item, i) => (
                <SidebarButton
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  active={isRouteActive(item.route)}
                  onPress={() => handleNavigation(item.route)}
                />
              ))}
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                {userType === 'volunteer_guest' ? t('account') : t('security')}
              </Text>
              {securityItems.map((item, i) => (
                <SidebarButton
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  active={isRouteActive(item.route)}
                  onPress={() => handleNavigation(item.route)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}