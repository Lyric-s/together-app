import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Mission } from '@/models/mission.model';
import { volunteerService } from '@/services/volunteerService';
import MissionVolunteerCardHorizontal from '@/components/MissionVolunteerCardHorizontal';
import { styles } from '@/styles/pages/UpcomingVolunteerCSS';

export default function LibraryUpcoming() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const [enrolled, setEnrolled] = useState<Mission[]>([]);
  const [favorites, setFavorites] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Chargement parallèle
      const [enrolledData, favoritesData] = await Promise.all([
        volunteerService.getEnrolledMissions(),
        volunteerService.getFavorites()
      ]);
      setEnrolled(enrolledData || []);
      setFavorites(favoritesData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressMission = (id: number) => {
    router.push(`/(volunteer)/search/mission/${id}` as any);
  };

  const handleToggleFavorite = async (id: number) => {
    console.log("Toggle fav", id);
    try {
        await volunteerService.removeFavorite(id);
        loadData();
    } catch (e) {
        console.error(e);
        loadData();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Titre Page */}
        {!isWeb && (
             <View style={styles.headerMobile}>
                <View style={styles.logoContainer}>
                    <Image source={require('@/assets/images/logo.png')} style={{ width: 40, height: 40 }} resizeMode="contain"/>
                </View>
            </View>
        )}
        <Text style={[styles.pageTitle, isSmallScreen && {paddingLeft: 60, paddingTop: 10}]}>Ma Bibliothèque</Text>

        <View>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.orange} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* SECTION: A VENIR */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>A venir</Text>
              {enrolled.length === 0 ? (
                <Text style={styles.emptyText}>Aucune mission prévue prochainement.</Text>
              ) : (
                enrolled.map(mission => (
                  <MissionVolunteerCardHorizontal
                    key={mission.id_mission}
                    mission={mission}
                    onPressMission={() => handlePressMission(mission.id_mission)}
                  />
                ))
              )}
            </View>

            {/* SECTION: FAVORIS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Favoris</Text>
              {favorites.length === 0 ? (
                <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
              ) : (
                favorites.map(mission => (
                  <MissionVolunteerCardHorizontal
                    key={mission.id_mission}
                    mission={mission}
                    isFavorite={true}
                    onPressMission={() => handlePressMission(mission.id_mission)}
                    onPressFavorite={() => handleToggleFavorite(mission.id_mission)}
                  />
                ))
              )}
            </View>
          </>
        )}
        </View>
      </ScrollView>
    </View>
  );
}

