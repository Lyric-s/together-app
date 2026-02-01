import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { Text } from '@/components/ThemedText';
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
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  // --- DATA ---
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [categories, setCategories] = useState<Category[]>([]);

  const isFirstLoad = useRef(true);

  useFocusEffect(
    useCallback(() => {
    let cancelled = false;

    const loadData = async () => {
      // Use ref to check if it's the first load, avoiding dependency on allMissions state
      if (isFirstLoad.current) {
          setLoading(true);
      }

      try {
        const [missionsData, categoriesData, favoritesData] = await Promise.all([
          missionService.getAll(),
          categoryService.getAll(),
          userType === 'volunteer' ? volunteerService.getFavorites() : Promise.resolve([]),
        ]);
        if (cancelled) return;
        const newMissions = missionsData || [];
        setAllMissions(newMissions);
        setCategories(categoriesData || []);
        
        setFilteredMissions(prev => {
             // If the previous list was complete (no filter), update it.
             if (isFirstLoad.current || prev.length === 0) {
                 return newMissions;
             }
             return prev;
        });

        if (favoritesData) {
            const ids = favoritesData.map((m) => m.id_mission);
            setFavoriteIds(ids);
          } else {
            setFavoriteIds([]);
          }

        } catch (error) {
            if (cancelled) return;
            console.error(error);
            if (isFirstLoad.current) setToast({ visible: true, title: t('error'), message: t('loadError') });
      } finally {
        if (!cancelled) {
          setLoading(false);
          isFirstLoad.current = false;
        }
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [userType, t]) 
  );

  /**
   * Unified filtering logic
   * @param text - Search text (mission name)
   * @param filters - Object containing category, postcode, date
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
      showToast(t('loginRequired'), t('loginToAct'));
      return false;
    }
    return true;
  }, [userType, showToast, t]);

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
      showToast(t('error'), t('favError'));
    }
  }, [checkAuthAndRedirect, favoriteIds, showToast, t]);

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
          {t('searchMission')}
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
                    <Text style={{textAlign: 'center', marginTop: 50, color: 'gray'}}>{t('noMissionsFound')}</Text>
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
          loading ? (
            <View style={{flex: 1, justifyContent:'center', alignItems:'center', marginTop: 50}}>
              <ActivityIndicator size="large" color={Colors.orange} />
            </View>
          ) : (
            <Text style={{textAlign: 'center', marginTop: 50, color: 'gray'}}>{t('noMissionsFound')}</Text>
          )
        }
        />
      )}
      </KeyboardAvoidingView>
    </View>
  );
}