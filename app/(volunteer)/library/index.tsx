/**
 * @file app/(volunteer)/library/index.tsx
 * @description Point d'entrée de la bibliothèque.
 * - WEB : Redirige vers la sous-route '/upcoming'.
 * - MOBILE : Affiche l'interface complète avec gestion d'état locale (A venir / Historique).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Mission } from '@/models/mission.model';
import { volunteerService } from '@/services/volunteerService';
import LibraryVolunteerView from '@/components/LibraryVolunteerView';
import SwitchButton from '@/components/SwitchButton';
import { useLanguage } from '@/context/LanguageContext';

export default function LibraryIndex() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { t } = useLanguage();

  if (isWeb) {
    return <Redirect href="/(volunteer)/library/upcoming" />;
  }
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [favorites, setFavorites] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'upcoming') {
        const [enrolledData, favoritesData] = await Promise.all([
          volunteerService.getEnrolledMissions(),
          volunteerService.getFavorites()
        ]);
        setMissions(enrolledData || []);
        setFavorites(favoritesData || []);
      } else {
        const historyData = await volunteerService.getHistoryMissions();
        setMissions(historyData || []);
        setFavorites([]); 
      }
    } catch (error) {
      console.error("Erreur library mobile:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePressMission = (id: number) => {
    router.push(`/(volunteer)/search/mission/${id}`);
  };

  const handleToggleFavorite = async (id: number) => {
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
      {/* Header Mobile */}
      <View style={styles.headerMobile}>
        <View style={styles.logoContainer}>
            <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
            />
        </View>
    </View>
        
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t('myLibrary')}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.orange} style={{ marginTop: 50 }} />
        ) : (
          <View style={{ marginBottom: 80 }}> 
            
            {/* --- CONTENU ONGLET "A VENIR" --- */}
            {activeTab === 'upcoming' ? (
                <LibraryVolunteerView 
                    loading={loading}
                    title={t('upcomingBtn')}
                    missions={missions} // Liste A venir
                    favorites={favorites} // Liste Favoris
                    emptyText={t('noPlannedMissions')}
                    onPressMission={handlePressMission}
                    onToggleFavorite={handleToggleFavorite}
                />
            ) : (
                <LibraryVolunteerView 
                    loading={loading}
                    title={t('historyBtn')}
                    missions={missions} // Liste Historique
                    emptyText={t('noPastMissions')}
                    onPressMission={handlePressMission}
                />
            )}
            </View>)}
        </ScrollView>
      {/* --- NAVIGATION SWITCH (Fixe en bas) --- */}
      <View style={styles.fixedBottom}>
        <SwitchButton 
          variant="activityVolunteer" 
          labelLeft={t('upcomingBtn')}
          labelRight={t('historyBtn')}
          valueLeft="upcoming"
          valueRight="history"
          value={activeTab} // L'état local contrôle quel bouton est allumé
          onChange={(tab) => setActiveTab(tab as 'upcoming' | 'history')} // Change l'état au lieu de l'URL
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  headerMobile: {
    backgroundColor: Colors.white,
    padding: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.black,
  },
  emptyText: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
});