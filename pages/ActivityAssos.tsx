// ActivityAssos.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import CategoryLabel from '@/components/CategoryLabel';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/ActivityAssosCSS';
import ListeBenevolesModal from '@/components/ListBenevolesModal';
import { Mission, MissionPublic } from '@/models/mission.model';
import { Volunteer, VolunteerStatus, VolunteerWithStatus } from '@/models/volunteer.model';
import { router } from 'expo-router';
import { associationService } from '@/services/associationService';
import { volunteerService } from '@/services/volunteerService';
import { ProcessingStatus } from '@/models/enums';

export const mapVolunteerStatusToVolunteerWithStatus = async (
  volunteerStatuses: VolunteerStatus[]
): Promise<VolunteerWithStatus[]> => {
  const volunteers = await Promise.all(
    volunteerStatuses.map(async (vs) => {
      const fullProfile = await volunteerService.getById(vs.id_volunteer);

      if (!fullProfile) {
        // fallback minimal si l’API échoue
        return {
          id_volunteer: vs.id_volunteer,
          id_user: 0,
          first_name: vs.volunteer_first_name,
          last_name: vs.volunteer_last_name,
          phone_number: vs.volunteer_phone,
          birthdate: '',
          skills: vs.volunteer_skills,
          bio: '',
          active_missions_count: 0,
          finished_missions_count: 0,
          state: vs.state,
        } as VolunteerWithStatus;
      }

      return {
        id_volunteer: fullProfile.id_volunteer,
        id_user: fullProfile.id_user,
        first_name: fullProfile.first_name,
        last_name: fullProfile.last_name,
        phone_number: fullProfile.phone_number,
        birthdate: fullProfile.birthdate,
        skills: fullProfile.skills,
        address: fullProfile.address,
        zip_code: fullProfile.zip_code,
        bio: fullProfile.bio,
        active_missions_count: fullProfile.active_missions_count,
        finished_missions_count: fullProfile.finished_missions_count,
        user: fullProfile.user,
        state: vs.state,
      } as VolunteerWithStatus;
    })
  );

  return volunteers;
};

/**
 * ActivityAssos
 *
 * Component for the association's activity dashboard, showing a list of finished missions.
 * 
 * Features:
 * - Fetches finished missions from the backend API (`associationService.getMyFinishedMissions`)
 * - Converts API missions (MissionPublic) to internal Mission model
 * - Displays mission cards with details: name, dates, category, participant counts
 * - Provides two actions per mission:
 *    1. "Voir la mission" → navigates to mission details page
 *    2. "Voir les bénévoles" → opens a modal listing volunteers for that mission
 * - Includes responsive layout for small screens
 *
 * State:
 * - missions: Array of finished missions
 * - modalVisible: Whether the volunteer list modal is open
 * - missionClick: Currently selected mission for volunteer modal
 * - search: Search filter for volunteers
 * - benevoles: Volunteers of the selected mission
 * - loading: Loading state for API calls
 */
export default function ActivityAssos() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;

  // ---------------------
  // STATE
  // ---------------------
  const [missions, setMissions] = useState<MissionPublic[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [missionClick, setMissionClick] = useState<Mission | null>(null);
  const [search, setSearch] = useState('');
  const [benevoles, setBenevoles] = useState<VolunteerWithStatus[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------------
  // LOAD FINISHED MISSIONS FROM API
  // ---------------------
  useEffect(() => {
    const loadMissions = async () => {
      setLoading(true);
      try {
        // Fetch finished missions 
        const missionsData = await associationService.getMyMissions();
        setMissions(missionsData);
      } catch (error) {
        console.error("Error loading finished missions:", error);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, []);

  // ---------------------
  // LOAD VOLUNTEERS FOR A SPECIFIC MISSION
  // ---------------------
  const loadBenevoles = async (missionId: number) => {
    setLoading(true);
    try {
      const volunteersStatus = await associationService.getMissionEngagements(missionId);
      const volunteers_V = await mapVolunteerStatusToVolunteerWithStatus(volunteersStatus)
      setBenevoles(volunteers_V); // populate volunteer modal
    } catch (error) {
      console.error('Error loading volunteers:', error);
      setBenevoles([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // OPEN MODAL FOR SELECTED MISSION
  // ---------------------
  const openModal = async (mission: Mission) => {
    setMissionClick(mission);
    await loadBenevoles(mission.id_mission);
    setSearch(''); // reset search
    setModalVisible(true);
  };

  const handleViewVolunteers = (missionId: number) => {
    const mission = missions.find(m => m.id_mission === missionId);
    if (mission) openModal(mission);
  };

  // ---------------------
  // RENDER A MISSION CARD
  // ---------------------
  const renderMissionCard = (mission: MissionPublic) => (
    <View key={mission.id_mission} style={styles.missionCard}>
      {/* Mission information */}
      <View style={styles.missionInfo}>
        <Text style={styles.missionTitle}>{mission.name}</Text>
        <Text style={styles.missionDetail}>
          {mission.date_start} au {mission.date_end}
        </Text>
        <View style={[styles.categoryContainer, { marginVertical: -2, marginLeft: -10 }]}>
          <CategoryLabel
            text={`Catégorie ${mission.category?.label || mission.id_categ}`}
            backgroundColor={Colors.brightOrange}
          />
        </View>
      </View>

      {/* Actions section */}
      <View style={styles.actionsSection}>
        <View style={styles.buttonsContainer}>
          {/* Navigate to mission details */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#E8D5FF' }]}
            onPress={() => router.push(`/(association)/library/upcoming/${mission.id_mission.toString()}`)}
          >
            <Text style={[styles.buttonText, { color: '#7C3AED' }]}>Voir la mission</Text>
          </TouchableOpacity>

          {/* Open volunteer modal */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D1FAE5' }]}
            onPress={() => handleViewVolunteers(mission.id_mission)}
          >
            <Text style={[styles.buttonText, { color: '#059669' }]}>Voir les bénévoles</Text>
          </TouchableOpacity>
        </View>

        {/* Display number of participants */}
        <View style={styles.imageSection}>
          <View style={styles.participantsContainer}>
            <Text style={styles.participantsText}>
              {mission.volunteers_enrolled} / {mission.capacity_max}
            </Text>
            <Image source={require('@/assets/images/people.png')} style={styles.participantsIcon} />
          </View>
        </View>
      </View>
    </View>
  );

  // ---------------------
  // COMPONENT RENDER
  // ---------------------
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.darkerWhite }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          <Text style={[styles.pageTitle, isSmallScreen && { paddingLeft: 55 }]}>
            Missions terminées
          </Text>
          <View style={styles.missionsList}>
            {missions.map(renderMissionCard)}
          </View>
        </ScrollView>
      </View>

      {/* Volunteer list modal */}
      <ListeBenevolesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={missionClick?.name || ''}
        search={search}
        setSearch={setSearch}
        benevoles={benevoles}
        setBenevoles={setBenevoles}
        missionId={missionClick?.id_mission ?? 0}
      />
    </View>
  );
}
