// components/VolunteerLibraryView.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Colors } from '@/constants/colors';
import { Mission } from '@/models/mission.model';
import MissionVolunteerCard from '@/components/MissionVolunteerCard';
import { useLanguage } from '@/context/LanguageContext';

interface LibraryViewProps {
  loading: boolean;
  missions: Mission[];
  favorites?: Mission[];
  title: string;
  emptyText: string;
  onPressMission: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

export default function VolunteerLibraryView({ 
  loading, missions, favorites, title, emptyText, onPressMission, onToggleFavorite 
}: LibraryViewProps) {
  const { t } = useLanguage();
  
  if (loading) {
    return <ActivityIndicator size="large" color={Colors.orange} style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ marginBottom: 10 }}>
      {/* SECTION PRINCIPALE */}
      <View style={styles.section}>
        {/* Titre aligné à gauche */}
        <Text style={styles.sectionTitle}>{title}</Text>
        
        {/* Conteneur des cartes aligné au centre */}
        <View style={styles.cardsContainer}>
          {missions.length === 0 ? (
            <Text style={styles.emptyText}>{emptyText}</Text>
          ) : (
            missions.map(mission => (
              <MissionVolunteerCard
                key={mission.id_mission}
                mission={mission}
                onPressMission={() => onPressMission(mission.id_mission)}
              />
            ))
          )}
        </View>
      </View>

      {/* SECTION FAVORIS */}
      {favorites && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('favorites')}</Text>
          <View style={styles.cardsContainer}>
            {favorites.length === 0 ? (
              <Text style={styles.emptyText}>{t('noFavorites')}</Text>
            ) : (
              favorites.map(mission => (
                <MissionVolunteerCard
                  key={mission.id_mission}
                  mission={mission}
                  isFavorite={true}
                  onPressMission={() => onPressMission(mission.id_mission)}
                  onPressFavorite={onToggleFavorite ? () => onToggleFavorite(mission.id_mission) : undefined}
                />
              ))
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.black,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },

  cardsContainer: {
    alignItems: 'center',
    width: '100%',
  },

  emptyText: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});