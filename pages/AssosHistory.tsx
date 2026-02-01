/**
 * @file AssosHistory.tsx
 * @description Displays the list of completed missions for an association.
 *              Fetches finished missions from the API and maps them to Mission objects.
 *              Renders either an empty state or MissionAdminAssosCard components.
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

import MissionAdminAssosCard from '@/components/MissionAdminAssosCard';
import { styles } from '@/styles/pages/AssosHistoryStyle';
import { Mission } from '@/models/mission.model';
import { associationService } from '@/services/associationService';
import { mapMissionPublicToMission } from '@/utils/mission.utils';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Display the association's finished missions screen, fetching finished missions on mount and rendering a loading indicator, an empty state, or a scrollable list of mission cards.
 *
 * The component loads finished missions from the association service, maps API mission data to the internal Mission model, and adapts the title layout for small screens. Text strings are localized via the language context.
 *
 * @returns A React element rendering the finished missions view (loading state, empty message, or list of MissionAdminAssosCard components).
 */
export default function AssosHistory() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const { t } = useLanguage();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  // Load finished missions on mount
  useEffect(() => {
    const loadFinishedMissions = async () => {
      setLoading(true);
      try {
        const finishedMissionsPublic = await associationService.getMyFinishedMissions();
        if (finishedMissionsPublic) {
          const finishedMissions = finishedMissionsPublic.map(mapMissionPublicToMission);
          setMissions(finishedMissions);
        } else {
          setMissions([]);
        }
      } catch (error) {
        console.error('Error loading finished missions:', error);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadFinishedMissions();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TITLE */}
        <Text style={[styles.title, isSmallScreen ? { paddingLeft: 55 } : {}]}>{t('finishedMissionsTitle')}</Text>

        {/* CONTENT */}
        {loading ? (
          <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 50 }} />
        ) : missions.length === 0 ? (
          <Text style={styles.emptyText}>{t('noFinishedMissions')}</Text>
        ) : (
          <ScrollView>
            <View style={styles.cardsContainer}>
              {missions.map((mission) => (
                <MissionAdminAssosCard key={mission.id_mission} mission={mission} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}