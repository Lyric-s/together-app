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
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <View style={styles.footer}>
      <View style={[styles.contentContainer, isSmallScreen && styles.contentContainerMobile]}>
        
        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('accessibility')}</Text>
          <View style={styles.linksGroup}>
            <HoverLink onPress={() => router.push('/settings/language')}>{t('language')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/language')}>{t('textSize')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/language')}>{t('contrast')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/language')}>{t('theme')}</HoverLink>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('infos')}</Text>
          <View style={styles.linksGroup}>
            <HoverLink onPress={() => router.push('/settings/about')}>{t('about')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/privacy')}>{t('privacyPolicy')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/terms')}>{t('legalMentions')}</HoverLink>
            <HoverLink onPress={() => router.push('/settings/terms')}>{t('cgu')}</HoverLink>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contacts')}</Text>
          <View style={styles.linksGroup}>
            <Text style={styles.contactText}>{t('phoneLabel')} 01 82 88 81 73</Text>
            <Text style={styles.contactText}>Email : toTogether@mail.com</Text>
          </View>
        </View>

      </View>

      {/* Copyright */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Together - {t('rightsReserved')}
        </Text>
      </View>
    </View>
  );
}