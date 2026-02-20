// pages/HomeVolunteer.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import MissionVolunteerCard from '@/components/MissionVolunteerCard';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/AccountWithoutCoCSS';
import { Mission } from '@/models/mission.model';
import { missionService } from '@/services/missionService';
import Footer from '@/components/footer';
import AlertToast from '@/components/AlertToast';
import { volunteerService } from '@/services/volunteerService';

/**
 * Render the volunteer account screen with responsive layouts for mobile and web.
 *
 * Displays recent missions and favorited missions, manages local state for missions and favorites,
 * and exposes handlers for opening mission details, toggling favorites (with backend save), and showing alerts.
 *
 * @returns The rendered JSX element for the volunteer account screen.
 */
export default function HomeVolunteer() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  const isSmallScreen = width < 900;

  const [missions, setMissions] = useState<Mission[]>([]);
  const [favorites, setFavorites] = useState<Mission[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingF, setLoadingF] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [errorF, setErrorF] = useState<string | null>(null);

  const [alertModal, setAlertModal] = useState({ 
    visible: false, 
    title: '', 
    message: '' 
  });

  const showAlert = useCallback((title: string, message: string) => {
    setAlertModal({ visible: true, title, message });
  }, []);

  const loadMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await missionService.getAll();
      setMissions(data ?? []);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les missions pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMissionsFavorites = useCallback(async () => {
    setLoadingF(true);
    setErrorF(null);
    try {
      const favoritesData = await volunteerService.getFavorites();
      setFavorites(favoritesData ?? []);
      setFavoriteIds(favoritesData.map(m => m.id_mission));
    } catch (e) {
      console.error(e);
      setErrorF("Impossible de charger les missions favorites pour le moment.");
    } finally {
      setLoadingF(false);
    }
  }, []);

  const handleToggleFavorite = async (mission: Mission) => {
    const isFav = favoriteIds.includes(mission.id_mission);
    
    if (isFav) {
        setFavoriteIds(prev => prev.filter(id => id !== mission.id_mission));
        setFavorites(prev => prev.filter(m => m.id_mission !== mission.id_mission));
    } else {
        setFavoriteIds(prev => [...prev, mission.id_mission]);
        setFavorites(prev => [...prev, mission]);
    }

    try {
        if (isFav) {
            await volunteerService.removeFavorite(mission.id_mission);
            console.log("Favori retiré");
        } else {
            await volunteerService.addFavorite(mission.id_mission);
            console.log("Favori ajouté");
        }
    } catch (error) {
        console.error("Erreur API Favoris", error);
        if (isFav) {
            setFavoriteIds(prev => [...prev, mission.id_mission]);
            setFavorites(prev => [...prev, mission]);
        } else {
            setFavoriteIds(prev => prev.filter(id => id !== mission.id_mission));
            setFavorites(prev => prev.filter(m => m.id_mission !== mission.id_mission));
        }
        showAlert("Erreur","Impossible de modifier les favoris pour le moment.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMissions();
      loadMissionsFavorites();
    }, [loadMissions, loadMissionsFavorites])
  );

  const handlePressMission = (missionId: number) => {
    console.log('Mission pressed:', missionId);
    router.push(`/(volunteer)/search/mission/${missionId}`);
  };

  return (
    <View style={[styles.container, { flex: 1 }]}> 
      
      {/* Header Mobile Only */}
      {isMobile && (
        <View style={styles.headerMobile}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
            isMobile ? { alignItems: 'center', paddingVertical: 5 } : {flexGrow: 1}
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* LISTE DES MISSIONS */}
        <View style={isMobile ? styles.sectionMobile : styles.sectionWeb}>
          <View style={styles.sectionHeader}>
            <Text style={isMobile ? styles.sectionTitle : [styles.sectionTitleWeb, isSmallScreen && {paddingLeft: 35}]}>
               {isMobile ? 'Récent' : 'Missions récentes'}
            </Text>
            
            {isMobile && (
              <TouchableOpacity onPress={() => router.push('/(volunteer)/search')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            {loading ? (
              <View style={{ minHeight: '60%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.orange} />
              </View>
            
            ) : error ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'gray', textAlign: 'center', marginBottom: 10 }}>
                    {error}
                </Text>
                <TouchableOpacity 
                  onPress={loadMissions}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.orange,
                    borderRadius: 20
                  }}
                >
                  <Text style={{ color: Colors.orange, fontWeight: '600' }}>
                    ↻ Recharger
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
            <View style={isMobile ? {alignItems:'center'} : styles.missionsGrid}>
              {missions.length === 0 ? (
                <Text style={{ color: 'gray', fontStyle: 'italic', padding: 20 }}>Aucune mission récente disponible pour le moment.</Text>
              ) : (
                missions.slice(0, 3).map((mission) => (
                  <View key={mission.id_mission} style={styles.cardWrapper}>
                    <MissionVolunteerCard
                      mission={mission}
                      isFavorite={favoriteIds.includes(mission.id_mission)}
                      onPressMission={() => handlePressMission(mission.id_mission)}
                      onPressFavorite={() => handleToggleFavorite(mission)}
                    />
                  </View>
                ))
              )}
            </View>
            )}
          </View>
        </View>

        {/* LISTE DES MISSIONS FAVORITES */}
        { !loadingF && favorites.length > 0 &&
        <View style={isMobile ? styles.sectionMobile : styles.sectionWeb}>
          <View style={styles.sectionHeader}>
            <Text style={isMobile ? styles.sectionTitle : [styles.sectionTitleWeb, isSmallScreen && {paddingLeft: 35}]}>
               {isMobile ? 'Favoris' : 'Missions favoris'}
            </Text>
            
            {isMobile && (
              <TouchableOpacity onPress={() => router.push('/(volunteer)/library/upcoming')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
             <View style={isMobile ? {alignItems:'center'} : styles.missionsGrid}>
                {favorites.slice(0, 3).map((mission) => (
                  <View key={`fav-${mission.id_mission}`} style={styles.cardWrapper}>
                    <MissionVolunteerCard
                      mission={mission}
                      isFavorite={true}
                      onPressMission={() => handlePressMission(mission.id_mission)}
                      onPressFavorite={() => handleToggleFavorite(mission)}
                    />
                  </View>
                ))}
             </View>
          </View>
        </View>
        }
        <View style={{ marginTop: 'auto' }} >
      {isWeb && <Footer />}
      </View>
      </ScrollView>
    </View>
  );
}