/**
 * @file AssosHistory.tsx
 * @description Displays the list of completed missions for an association.
 *              Fetches finished missions from the API and maps them to Mission objects.
 *              Renders either an empty state or MissionAdminAssosCard components.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import MissionAdminAssosCard from '@/components/MissionAdminAssosCard';
import { styles } from '@/styles/pages/AssosHistoryStyle';
import { Mission } from '@/models/mission.model';
import { associationService } from '@/services/associationService';
import { mapMissionPublicToMission } from '@/utils/mission.utils';

export default function AssosHistory() {
  const router = useRouter();

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
        <Text style={styles.title}>Les missions terminées</Text>

        {/* CONTENT */}
        {loading ? (
          <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 50 }} />
        ) : missions.length === 0 ? (
          <Text style={styles.emptyText}>Aucune mission terminée pour le moment.</Text>
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
