// app/(volunteer)/profile/calendarMobile.tsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Calendar from '@/components/Calendar';
import BackButton from '@/components/BackButton';
import { styles } from '@/styles/pages/CalenderMobileCSS';
import { useLanguage } from '@/context/LanguageContext';

export default function CalendarVolunteerPage() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <View style={styles.headerMobile}>
                <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                />
                </View>
            </View>
            <View style={styles.header}>
                    <BackButton name_page="" />
                    
                    <View style={styles.title}>
                        <Image
                        source={require("@/assets/images/calender.png")}
                        style={styles.editIcon}
                        />
                        <Text style={styles.headerTitle}>{t('myCalendar')}</Text>
                    </View>
                  </View>

            <Calendar />
        </View>
    );
}