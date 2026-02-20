import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Mission } from '@/models/mission.model';
import { volunteerService } from '@/services/volunteerService';
import MissionVolunteerCardHorizontal from '@/components/MissionVolunteerCardHorizontal';
import { styles } from '@/styles/pages/UpcomingVolunteerCSS';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Renders the volunteer library/history screen, fetching and displaying past missions with loading and empty states.
 *
 * Fetches the user's historical missions on mount, shows an activity indicator while loading, displays an empty message when there are no past missions, and renders a list of mission cards that navigate to mission detail routes when pressed.
 *
 * @returns A React element containing the LibraryHistory view.
 */
export default function LibraryHistory() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [history, setHistory] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await volunteerService.getHistoryMissions();
        setHistory(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, isSmallScreen ? {paddingLeft: 60, paddingTop: 10} : {}]}>{t('myLibrary')}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.orange} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('history')}</Text>
            {history.length === 0 ? (
              <Text style={styles.emptyText}>{t('noPastMissions')}</Text>
            ) : (
              history.map(mission => (
                <MissionVolunteerCardHorizontal
                  key={mission.id_mission}
                  mission={mission}
                  onPressMission={() => router.push(`/(volunteer)/search/mission/${mission.id_mission}` as any)}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}