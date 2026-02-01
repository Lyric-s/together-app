import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Text } from '@/components/ThemedText';
import { Href, router, useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from "@/components/BackButton";
import ButtonAuth from "@/components/Button";
import CategoryLabel from "@/components/CategoryLabel";
import { styles } from "@/styles/pages/JoinMissionStyle";
import { isMissionFinished } from '@/utils/mission.utils';
import { volunteerService } from '@/services/volunteerService';
import { missionService } from '@/services/missionService';
import { useAuth } from "@/context/AuthContext"; 
import { Mission } from "@/models/mission.model";
import { Colors } from "@/constants/colors";
import AlertToast from "@/components/AlertToast";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Display the mission details screen with responsive layout, mission metadata, and role-based actions.
 *
 * Shows loading and not-found states, formats mission dates and location for the current locale, and provides controlled actions for volunteers (apply to join and toggle favorites) while showing informational toasts for restricted users.
 *
 * @returns The rendered React component for the mission detail page.
 */
export default function JoinMissionPage() {
  const { id: missionId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSmallScreenWeb = isWeb && width < 900;
  const { user, userType } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [statusText, setStatusText] = useState(t('joinMission'));
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [error, setError] = useState(false);

  // FETCH MISSION
  useEffect(() => {
    setStatusText(t('joinMission')); // Reset text on language change or init
    const rawId = Array.isArray(missionId) ? missionId[0] : missionId;

    if (!rawId) {
      setError(true);
      setLoading(false);
      setMission(null);
      return;
    }
    const numericId = Number(rawId);
   if (isNaN(numericId)) {
      setError(true);
      setLoading(false);
      setMission(null);
      return;
   }
    const fetchMission = async () => {
      setLoading(true);
      setError(false);
      setMission(null);
      try {
        setLoading(true);
        const data = await missionService.getById(numericId);
        setMission(data);
        if (userType === 'volunteer') {
          try {
            const [favorites, myMissions] = await Promise.all([
              volunteerService.getFavorites(),
              volunteerService.getMyMissions()
            ]);
            
            const isAlreadyFavorite = favorites.some(fav => fav.id_mission === numericId);
            setIsFavorite(isAlreadyFavorite);

            // Check if already ACCEPTED
            const alreadyAccepted = myMissions.some(m => m.id_mission === numericId);
            if (alreadyAccepted) {
                setIsJoined(true);
                setStatusText(t('joinedValidated'));
            }
          } catch (favError) {
            console.warn("Could not load volunteer data:", favError);
          }
        }
      } catch (e) {
        console.error("Erreur chargement mission:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [missionId, userType, t]);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ visible: true, title, message });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  if (!mission) {
    return (
        <View>
            <View style={[
                styles.header,
                isSmallScreenWeb && { paddingLeft: 70 },
                isWeb && { paddingTop: 25 }
            ]}>
                <BackButton name_page={t('back')} />
            </View>
            <View>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>{error ? t('loadReportsError') : t('missionNotFound')}</Text>
            </View>
        </View>
    );
  }

  const finished = isMissionFinished(mission);
  const mission_category = mission.category?.label || t('generalCategory');
  const mission_category_color = Colors.orange; 
  const locationParts = [mission.location?.zip_code, mission.location?.country].filter(Boolean);
  const mission_location = locationParts.length > 0 
  ? locationParts.join(', ') 
  : t('locationUnspecified');

  const isFull = mission.is_full || (mission.available_slots !== undefined && mission.available_slots <= 0);

  const formatDateRange = (startStr: string, endStr?: string) => {
    if (!startStr) return t('dateToBeDefined');
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(startStr);
    
    // Helper localized format
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';

    if (isDateOnly) {
        const [y, m, d] = startStr.split('-');
        if (language === 'en') return `${y}-${m}-${d}`;
        return `${d}/${m}/${y}`;
    }
    
    const start = new Date(startStr);
    const dateFormatted = start.toLocaleDateString(locale);
    const startHour = start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    if (endStr) {
      const end = new Date(endStr);
      const endHour = end.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
      
      const isSameDay = start.toDateString() === end.toDateString();
      
      if (isSameDay) {
          return `${dateFormatted} ${t('fromTime')} ${startHour} ${t('toTime')} ${endHour}`;
      } else {
          const endDateFormatted = end.toLocaleDateString(locale);
          return `${t('fromDate')} ${dateFormatted} ${t('toDate')} ${endDateFormatted}`;
      }
    }
    return `${dateFormatted} ${t('toTime')} ${startHour}`; // 'à' or 'at' context
  };

  const checkAuthAndRedirect = () => {
    if (!userType || userType === 'volunteer_guest') {
      showToast(t('loginRequired'), t('loginToAct'));
      return false;
    }
    return true;
  };

  const handleJoinMission = async () => {
    if (!checkAuthAndRedirect()) return;
    if (userType !== 'volunteer' || !missionId) {
      showToast(t('actionUnavailable'), t('volunteersOnly'));
      return;
    }

    if (isJoined) {
        showToast("Info", t('alreadyJoinedInfo'));
        return;
    }

    setLoading(true);
    try {
      await volunteerService.applyToMission(Number(missionId));
      setIsJoined(true);
      setStatusText(t('waitingValidation'));
      showToast(t('success'), t('applicationSent'));
    } catch (e: any) {
      const msg = e.response?.data?.detail || e.message || "";
      // Detect specific backend error for already applied
      if (
          msg.toLowerCase().includes("already") || 
          msg.toLowerCase().includes("existe déjà") ||
          e.response?.status === 409 || 
          e.response?.status === 400
      ) {
          setIsJoined(true);
          setStatusText(t('waitingValidation'));
          showToast(t('alreadyApplied'), t('alreadyAppliedMsg'));
      } else {
          showToast(t('error'), t('missionCreateErr')); // Generic error or create error used as fallback
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!checkAuthAndRedirect()) return;
      if (userType !== 'volunteer') {
        showToast(t('actionUnavailable'), "Seuls les bénévoles peuvent gérer des favoris."); // Only volunters can manage favs
        return;
      }

    try {
      if (isFavorite) {
        await volunteerService.removeFavorite(mission.id_mission);
        setIsFavorite(false);
      } else {
        await volunteerService.addFavorite(mission.id_mission);
        setIsFavorite(true);
      }
    } catch (e: any) {
      showToast(t('error'), e.message || t('favError'));
    }
  };

  const goToAssociation = () => {
      if (mission.id_asso) {
        const isGuest = userType === 'volunteer_guest';
        const route = (isGuest
          ? `/(guest)/search/association/${mission.id_asso}`
          : `/(volunteer)/search/association/${mission.id_asso}`) as Href;
          router.push(route);
      }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]} >
      <AlertToast 
        visible={toast.visible} 
        title={toast.title} 
        message={toast.message} 
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />

      {/* HEADER */}
      <View style={[
          styles.header,
          !isWeb && { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 50 },
          isWeb && { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 25, gap: 2 },
          isSmallScreenWeb && { paddingLeft: 60 }
      ]}>
          <View style={!isWeb ? { position: 'absolute', left: 0, zIndex: 10 } : {}}>
              <BackButton name_page="" />
          </View>
          <Text 
              style={[ styles.headerTitle, isWeb ? { fontSize: 24, marginLeft: 0 } : {}, !isWeb ? { textAlign: 'center', maxWidth: '70%' } : {}]}
              numberOfLines={2}
          >
              {mission.name}
          </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isWeb && styles.scrollContentWeb, !isWeb && { paddingTop: 0 }]}
      >
        <View style={isWeb ? styles.webTopSection : undefined}>
          <Image 
            source={mission.image_url ? { uri: mission.image_url } : require("@/assets/images/volunteering_img.jpg")} 
            style={styles.missionImage}
          />

          <View style={isWeb ? styles.webInfoColumn : undefined}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('categoryLabel')} :</Text>
              <CategoryLabel text={mission_category} backgroundColor={mission_category_color} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('numVolunteers')}</Text>
              <View style={styles.volunteerRow}>
                <Text style={styles.volunteerText}>{mission.volunteers_enrolled} / {mission.capacity_max}</Text>
                <Image source={require("@/assets/images/people.png")} style={styles.peopleIcon} />
              </View>
              <Text style={styles.volunteerText}>{t('minNum')} {mission.capacity_min}</Text>
            </View>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.bottomCard}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
            <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>{t('association')} :</Text> {mission.association?.name || "Non spécifiée"}
            </Text>
            {!!mission.id_asso && (
              <TouchableOpacity 
                onPress={() => {
                    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                    goToAssociation();
                }} 
                style={{ marginLeft: 5 }}
              >
                  <Text style={{ color: Colors.orange, textDecorationLine: 'underline', fontWeight: '600' }}>
                      {t('seeProfile')}
                  </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>{t('date')} :</Text> {formatDateRange(mission.date_start, mission.date_end)}
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>{t('locationLabel')} :</Text> {mission_location}
          </Text>

          <Text style={styles.infoLabel}>{t('description')} :</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>

        {/* ACTIONS BUTTONS */}
        <View style={styles.actionsRow}>
            {!finished && (userType === 'volunteer' || userType === 'volunteer_guest') ? (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                      {isFull ? (
                          <View style={[styles.buttonDisabled]}>
                              <Text style={{ color: Colors.orange, fontSize: 20, fontWeight: '500', }}>{t('full')}</Text>
                          </View>
                      ) : (
                          <ButtonAuth 
                            text={statusText} 
                            onPress={handleJoinMission}
                            disabled={isJoined}
                            style={isJoined ? { backgroundColor: 'gray' } : undefined}
                          />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
                           document.activeElement.blur();
                        }
                        toggleFavorite();
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      accessibilityState={{ checked: isFavorite }}
                    >
                        <Image
                            source={isFavorite ? require("@/assets/images/red_heart.png") : require("@/assets/images/gray_heart.png")}
                            style={styles.heartIcon}
                            accessibilityIgnoresInvertColors
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                finished ? (
                    <Text style={{color: 'gray', fontStyle: 'italic', textAlign: 'center'}}>{t('missionFinished')}</Text>
                ) : (
                    <Text style={{color: 'gray', fontStyle: 'italic', textAlign: 'center'}}>{t('volunteersOnlyInteract')}</Text>
                )
            )}
        </View>
      </ScrollView>
    </View>
  );
}