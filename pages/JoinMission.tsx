/**
 * @file JoinMissionPage.tsx
 * @description Mission details page (Guest and Volunteer compatible)
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
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

/**
 * Renders the mission details page for guests and volunteers, including responsive layout, mission metadata, and role-based actions.
 *
 * Displays a loading indicator while fetching mission data from the route `id`, shows an error or not-found message when appropriate, and presents mission information (category, dates, location, association, description). Provides actions for authenticated volunteers to apply to the mission and toggle favorites; guests and non-volunteer users are shown informational toasts when attempting restricted actions. Toast notifications communicate success and error outcomes.
 *
 * @returns The mission detail screen UI component with loading/error handling, formatted date/location display, and join/favorite action controls conditioned on authentication and user role.
 */
export default function JoinMissionPage() {
  const { id: missionId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSmallScreenWeb = isWeb && width < 900;
  const { user, userType } = useAuth();
  const router = useRouter();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [statusText, setStatusText] = useState("Rejoindre la mission");
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [error, setError] = useState(false);

  // FETCH MISSION
  useEffect(() => {
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
                setStatusText("Inscrit (Validé)");
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
  }, [missionId, userType]);

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
                <BackButton name_page="Retour" />
            </View>
            <View>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>{error ? "Erreur lors du chargement. Réessayez." : "Mission introuvable"}</Text>
            </View>
        </View>
    );
  }

  const finished = isMissionFinished(mission);
  const mission_category = mission.category?.label || "Général";
  const mission_category_color = Colors.orange; 
  const locationParts = [mission.location?.zip_code, mission.location?.country].filter(Boolean);
  const mission_location = locationParts.length > 0 
  ? locationParts.join(', ') 
  : "Lieu non précisé";

  const isFull = mission.is_full || (mission.available_slots !== undefined && mission.available_slots <= 0);

  const formatDateRange = (startStr: string, endStr?: string) => {
    if (!startStr) return "Date à définir";
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(startStr);
    if (isDateOnly) {
        const [y, m, d] = startStr.split('-');
        return `${d}/${m}/${y}`;
    }
    
    const start = new Date(startStr);
    const dateFormatted = start.toLocaleDateString("fr-FR");
    const startHour = start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (endStr) {
      const end = new Date(endStr);
      const endHour = end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      
      const isSameDay = start.toDateString() === end.toDateString();
      
      if (isSameDay) {
          return `${dateFormatted} de ${startHour} à ${endHour}`;
      } else {
          const endDateFormatted = end.toLocaleDateString("fr-FR");
          return `Du ${dateFormatted} au ${endDateFormatted}`;
      }
    }
    return `${dateFormatted} à ${startHour}`;
  };

  const checkAuthAndRedirect = () => {
    if (!userType || userType === 'volunteer_guest') {
      showToast("Connexion requise", "Vous devez être connecté pour effectuer cette action.");
      return false;
    }
    return true;
  };

  const handleJoinMission = async () => {
    if (!checkAuthAndRedirect()) return;
    if (userType !== 'volunteer' || !missionId) {
      showToast("Action indisponible", "Seuls les bénévoles peuvent rejoindre une mission.");
      return;
    }

    if (isJoined) {
        showToast("Info", "Vous êtes déjà inscrit ou en attente de validation.");
        return;
    }

    setLoading(true);
    try {
      await volunteerService.applyToMission(Number(missionId));
      setIsJoined(true);
      setStatusText("En attente de validation");
      showToast("Succès", "Candidature envoyée ! En attente de validation par l'association.");
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
          setStatusText("En attente de validation");
          showToast("Déjà postulé", "Vous avez déjà rejoint cette mission, il faut la validation de l'association.");
      } else {
          showToast("Erreur", "Impossible de rejoindre la mission. Réessayez plus tard.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!checkAuthAndRedirect()) return;
      if (userType !== 'volunteer') {
        showToast("Action indisponible", "Seuls les bénévoles peuvent gérer des favoris.");
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
      showToast("Erreur", e.message || "Impossible de modifier les favoris.");
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

  if (loading && !mission) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
   
  if (!mission) {
    return <Text>Mission non trouvée.</Text>;
  }

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
              style={[ styles.headerTitle, isWeb && { fontSize: 24, marginLeft: 0 }, !isWeb && { textAlign: 'center', maxWidth: '70%' }]}
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
              <Text style={styles.label}>Catégorie :</Text>
              <CategoryLabel text={mission_category} backgroundColor={mission_category_color} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Nombre de bénévoles :</Text>
              <View style={styles.volunteerRow}>
                <Text style={styles.volunteerText}>{mission.volunteers_enrolled} / {mission.capacity_max}</Text>
                <Image source={require("@/assets/images/people.png")} style={styles.peopleIcon} />
              </View>
              <Text style={styles.volunteerText}>Nombre minimum : {mission.capacity_min}</Text>
            </View>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.bottomCard}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
            <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>Association :</Text> {mission.association?.name || "Non spécifiée"}
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
                      (Voir profil)
                  </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Date :</Text> {formatDateRange(mission.date_start, mission.date_end)}
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Lieu :</Text> {mission_location}
          </Text>

          <Text style={styles.infoLabel}>Description :</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>

        {/* ACTIONS BUTTONS */}
        <View style={styles.actionsRow}>
            {!finished && (userType === 'volunteer' || userType === 'volunteer_guest') ? (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                      {isFull ? (
                          <View style={[styles.buttonDisabled]}>
                              <Text style={{ color: Colors.orange, fontSize: 20, fontWeight: '500', }}>Complet</Text>
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
                    <Text style={{color: 'gray', fontStyle: 'italic', textAlign: 'center'}}>Cette mission est terminée.</Text>
                ) : (
                    <Text style={{color: 'gray', fontStyle: 'italic', textAlign: 'center'}}>Seules les bénévoles peuvent interagir avec cette mission.</Text>
                )
            )}
        </View>
      </ScrollView>
    </View>
  );
}
