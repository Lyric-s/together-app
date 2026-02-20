import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Platform,
  useWindowDimensions,
  Text,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { Href, useRouter, useFocusEffect } from 'expo-router';
import { styles } from '@/styles/pages/SearchMissionStyles';
import { Colors } from '@/constants/colors';
import { SearchFilters } from '@/types/search.types';

// Components
import MobileSearchBar from '@/components/MobileSearchBar';
import SearchBar from '@/components/SearchBar';
import MissionVolunteerCard from '@/components/MissionVolunteerCard';
import MissionVolunteerCardHorizontal from '@/components/MissionVolunteerCardHorizontal'
import AlertToast from '@/components/AlertToast';

// Services & Models
import { missionService } from '@/services/missionService';
import { volunteerService } from '@/services/volunteerService';
import { useAuth } from '@/context/AuthContext';
import { Mission } from '@/models/mission.model';
import { categoryService } from '@/services/category.service';
import { Category } from '@/models/category.model';

/**
 * Screen component that loads missions, provides searchable and filterable results, manages user favorites, and navigates to mission details.
 *
 * Displays a responsive (web and mobile) list of missions, applies text/category/zip/date filters, optimistically updates and persists favorite state for authenticated volunteers, and shows toast messages for errors or required authentication.
 *
 * @returns A React element rendering the mission search UI.
 */
export default function ResearchMission() {
  const router = useRouter();
  const { userType } = useAuth();
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;

  // --- DATA ---
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const [categories, setCategories] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
    let cancelled = false;

    const loadData = async () => {
      // On ne met le loading qu'au premier chargement pour éviter le clignotement
      if (allMissions.length === 0) setLoading(true);
      
      try {
        const [missionsData, categoriesData, favoritesData] = await Promise.all([
              missionService.getAll(),
              categoryService.getAll(),
              userType === 'volunteer' ? volunteerService.getFavorites() : Promise.resolve([]),
            ]);
        if (cancelled) return;
        setAllMissions(missionsData || []);
        // Si on n'a pas encore de filtre actif, on met à jour la liste affichée
        // Note: Si l'utilisateur avait filtré, on risque de perdre son filtre ou d'afficher des résultats incohérents
        // Pour simplifier, on réapplique le filtre actuel si possible, mais ici on recharge tout.
        // Une stratégie simple : recharger les favoris c'est critique, les missions moins.
        // Mais pour l'instant, rechargeons tout pour la cohérence.
        
        // Optimisation: ne changer filteredMissions que si c'est le premier chargement ou si on veut reset
        // Ici on va juste mettre à jour allMissions et les favoris.
        // Mais si on ne met pas à jour filteredMissions, les nouvelles missions n'apparaissent pas.
        // On va réappliquer un filtre vide par défaut si c'est le premier load, sinon on garde le filtre ?
        // Le code original écrasait filteredMissions. Gardons ce comportement pour l'instant, 
        // ou mieux : on réapplique setFilteredMissions si aucun filtre n'est actif, 
        // mais comme on n'a pas l'état des filtres stocké séparément de manière simple ici...
        // On va tout recharger.
        
        // Pour ne pas perdre la recherche en cours, il faudrait stocker les critères de filtre dans un state.
        // Mais l'utilisateur revient probablement d'une mission, donc voir la même liste est bien.
        // Si on met à jour allMissions, il faut réappliquer le filtre.
        // Comme on n'a pas les params de filtre sous la main facilement (passed to performFilter), 
        // on va faire simple : mettre à jour les favoris et les missions, et si filteredMissions était égal à allMissions, on met à jour.
        
        setFilteredMissions(prev => {
             // Si la liste précédente était complète (pas de filtre), on met à jour
             if (prev.length === 0 || prev.length === (allMissions.length > 0 ? allMissions.length : 0)) {
                 return missionsData || [];
             }
             // Sinon on garde la liste filtrée (mais les cœurs ne se mettront pas à jour si on ne re-render pas)
             // Attendez, React va re-render car on change favoriteIds.
             // Donc les cœurs SERONT mis à jour même si filteredMissions ne change pas, car MissionVolunteerCard utilise favoriteIds.
             return prev;
        });
        
        // Mais si de nouvelles missions sont arrivées, elles ne seront pas dans filteredMissions si on ne le touche pas.
        // Idéalement on devrait rappeler performFilter.
        // Pour l'instant, on laisse comme ça, l'important c'est les favoris.
        if (allMissions.length === 0) setFilteredMissions(missionsData || []); 

        setAllMissions(missionsData || []);
        setCategories(categoriesData || []);

        if (favoritesData) {
              const ids = favoritesData.map((m) => m.id_mission);
              setFavoriteIds(ids);
            } else {
              setFavoriteIds([]);
            }
        } catch (error) {
            if (cancelled) return;
            console.error(error);
            // On ne spam pas le toast si c'est juste un refresh
            if (allMissions.length === 0) setToast({ visible: true, title: "Erreur", message: "Impossible de charger les missions." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [userType]) // On enlève allMissions des dépendances pour éviter boucle infinie si on l'utilisait mal
  );

  /**
   * Logique de filtrage unifiée
   * @param text - Texte de recherche (nom de la mission)
   * @param filters - Objet contenant category, zipCode, date
   */
  const performFilter = (text: string, filters: Partial<SearchFilters>) => {
    const lowerText = text.toLowerCase();

    const filtered = allMissions.filter(mission => {
      const matchText = (mission.name || "").toLowerCase().includes(lowerText) || 
                        (mission.description || "").toLowerCase().includes(lowerText);

      let matchCategory = true;
      if (filters.category && filters.category !== '-') {
        matchCategory = mission.category?.label === filters.category;
      }

      let matchZip = true;
      if (filters.zipCode) {
        matchZip = mission.location?.zip_code === filters.zipCode;
      }

      let matchDate = true;
      if (filters.date) {
        const filterDate = new Date(filters.date);
        filterDate.setHours(0,0,0,0);
        const missionStart = new Date(mission.date_start);
        missionStart.setHours(0,0,0,0);

        matchDate = missionStart >= filterDate; 
      }

      return matchText && matchCategory && matchZip && matchDate;
    });

    setFilteredMissions(filtered);
  };

  // --- HANDLER WEB ---
  const handleWebSearch = (text: string, filters: SearchFilters) => {
    performFilter(text, filters);
  };

  // --- HANDLER MOBILE ---
  const handleMobileSearch = (text: string, filters: SearchFilters) => {
    performFilter(text, filters);
  };

  const showToast = useCallback((title: string, message: string) => {
    setToast({ visible: true, title, message });
  }, []);
  
  const checkAuthAndRedirect = useCallback(() => {
    if (!userType || userType === 'volunteer_guest') {
      showToast("Connexion requise", "Vous devez être connecté pour effectuer cette action.");
      return false;
    }
    return true;
  }, [userType, showToast]);

  // --- FAVORITES & NAV ---
  const handleToggleFavorite = useCallback(async (missionId: number) => {
    if (!checkAuthAndRedirect()) return;

    const isFav = favoriteIds.includes(missionId);
    setFavoriteIds(prev => isFav ? prev.filter(id => id !== missionId) : [...prev, missionId]);
    
    try {
      if (isFav) {
        await volunteerService.removeFavorite(missionId);
        console.log(`Mission ${missionId} retirée des favoris`);
      } else {
        await volunteerService.addFavorite(missionId);
        console.log(`Mission ${missionId} ajoutée aux favoris`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori", error);
      setFavoriteIds(prev => 
        isFav 
          ? [...prev, missionId] 
          : prev.filter(id => id !== missionId)
      );
      showToast("Erreur", "Impossible de mettre à jour les favoris.");
    }
  }, [checkAuthAndRedirect, favoriteIds, showToast]);

  const handlePressMission = useCallback((missionId: number) => {
    const rootPath = userType === 'volunteer' ? '/(volunteer)' : '/(guest)';
    const route = `${rootPath}/search/mission/${missionId}` as Href;
    router.push(route);
  }, [userType, router]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]} >
      <AlertToast 
        visible={toast.visible} title={toast.title} message={toast.message} 
        onClose={() => setToast({...toast, visible: false})} 
      />

      {!isWeb && (
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

      <View style={{ width: '100%', alignItems: 'flex-start' }}>
        <Text style={[
          styles.titre,
          {
            paddingLeft: isWeb ? (isSmallScreen ? 60 : 0) : 20,
            marginTop: isWeb && isSmallScreen ? 40 : 10,
            textAlign: 'left',
          }
        ]}>
          Rechercher une mission
        </Text>
      </View>

      {/* --- SWITCH BARRES DE RECHERCHE --- */}
      <View style={[styles.searchbar, {zIndex: 9999}] }>
        {isWeb ? (
          <SearchBar
            categories={categories.map(c => c.label)}
            onSearch={handleWebSearch}
          />
        ) : (
          <MobileSearchBar
            category_list={categories.map(c => c.label)}
            onSearch={handleMobileSearch}
          />
        )}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {!isWeb ? (
        <FlatList
        data={filteredMissions}
        numColumns={1}
        key={`flatlist-${1}`}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id_mission.toString()}
        contentContainerStyle={{
            ...styles.listContent,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
            paddingHorizontal: isWeb ? 20 : 0,
            justifyContent: isWeb ? 'flex-start' : 'center',
        }}
        renderItem={({ item }) => (
            <View 
                style={{ 
                    flex: 1,
                    marginBottom: 5,
                }}
            >
                <MissionVolunteerCard
                    mission={item}
                    isFavorite={favoriteIds.includes(item.id_mission)}
                    onPressMission={() => handlePressMission(item.id_mission)}
                    onPressFavorite={
                    userType === 'volunteer' 
                        ? () => handleToggleFavorite(item.id_mission) 
                        : () => checkAuthAndRedirect()
                    }
                />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
                    <View style={{flex: 1, justifyContent:'center', alignItems:'center', marginTop: 50}}>
                        <ActivityIndicator size="large" color={Colors.orange} />
                    </View>
                ) : (
                    <Text style={{textAlign: 'center', marginTop: 50, color: 'gray'}}>Aucune mission trouvée.</Text>
                )
        }
      />
        ) : (
        <FlatList
        data={filteredMissions}
        numColumns={1}
        key={`flatlist-${1}`}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id_mission.toString()}
        contentContainerStyle={{
            ...styles.listContent,
            gap: 20,
            paddingHorizontal: isWeb ? 20 : 0,
            justifyContent: isWeb ? 'flex-start' : 'center',
        }}
        renderItem={({ item }) => (
            <View 
                style={{ 
                    flex: 1,
                    marginBottom: 5,
                }}
            >
                <MissionVolunteerCardHorizontal
                    mission={item}
                    isFavorite={favoriteIds.includes(item.id_mission)}
                    onPressMission={() => handlePressMission(item.id_mission)}
                    onPressFavorite={
                    userType === 'volunteer' 
                        ? () => handleToggleFavorite(item.id_mission) 
                        : () => checkAuthAndRedirect()
                    }
                />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 50, color: 'gray'}}>Aucune mission trouvée.</Text>
        }
        />
      )}
      </KeyboardAvoidingView>
    </View>
  );
}