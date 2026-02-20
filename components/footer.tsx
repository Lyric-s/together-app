/**
 * @file Footer.tsx
 * @description Application footer component.
 *
 * Provides quick access to accessibility settings, legal information,
 * and contact details. Designed to be compact and responsive.
 */

import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/components/FooterStyle';
import { Colors } from '@/constants/colors';

type HoverLinkProps = {
  children: React.ReactNode;
  onPress: () => void;
};

/**
 * Hoverable text link component.
 */
const HoverLink = ({ children, onPress }: HoverLinkProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      <Text style={[styles.link, hovered && styles.linkHover]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={styles.footer}>
      <View style={[styles.contentContainer, isSmallScreen && styles.contentContainerMobile]}>
        
        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibilité</Text>
          <View style={styles.linksGroup}>
            <HoverLink onPress={() => router.push('/settings')}>Langue</HoverLink>
            <HoverLink onPress={() => router.push('/settings')}>Taille texte</HoverLink>
            <HoverLink onPress={() => router.push('/settings')}>Contraste</HoverLink>
            <HoverLink onPress={() => router.push('/settings')}>Thème</HoverLink>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Infos</Text>
          <View style={styles.linksGroup}>
            <HoverLink onPress={() => router.push('/about_us')}>À propos</HoverLink>
            <HoverLink onPress={() => router.push('/privacy')}>Confidentialité</HoverLink>
            <HoverLink onPress={() => router.push('/mentions_legales')}>Mentions légales</HoverLink>
            <HoverLink onPress={() => router.push('/cgu')}>CGU</HoverLink>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.linksGroup}>
            <Text style={styles.contactText}>Téléphone : 01 82 88 81 73</Text>
            <Text style={styles.contactText}>Email : toTogether@mail.com</Text>
          </View>
        </View>

      </View>

      {/* Copyright */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Together - Tous droits réservés
        </Text>
      </View>
    </View>
  );
}