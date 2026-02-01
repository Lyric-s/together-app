/**
 * ChangeMission Page
 * 
 * This React Native component allows association users to view, edit, and delete a mission.
 * It displays mission details (title, dates, capacity, location, etc.) and supports:
 *  - Fetching a mission by ID
 *  - Editing mission properties (title, description, dates, etc.)
 *  - Validating and saving updates
 *  - Deleting missions with confirmation
 * 
 * Technologies: React Native (Expo), TypeScript, Expo Router
 * Related services:
 *  - `missionService`: fetches public mission data
 *  - `associationService`: updates and deletes association-owned missions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Modal, useWindowDimensions, Image, ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/ChangeMissionCSS';
import { Mission, MissionPublic, MissionUpdate } from '@/models/mission.model';
import { associationService } from '@/services/associationService';
import BackButton from '@/components/BackButton';
import AlertToast from '@/components/AlertToast';
import DatePickerField from '@/components/DatePickerFields';
import { missionService } from '@/services/missionService';
import { mapMissionPublicToMission } from '@/utils/mission.utils';
import { useLanguage } from '@/context/LanguageContext';

// Default image placeholder
const DEFAULT_MISSION_IMAGE = require("@/assets/images/volunteering_img.jpg");


/**
 * Main Component: ChangeMission
 * 
 * This screen shows mission details and lets the association edit or delete the mission.
 */
export default function ChangeMission() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const missionId = Number(id);
  const { t, language, getFontSize, fontFamily } = useLanguage();


  // ====== STATE VARIABLES ======
  const [mission, setMission] = useState<Mission | null>(null);
  const [originalMission, setOriginalMission] = useState<Mission | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [missionPublic, setMissionPublic] = useState<MissionPublic | null>(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const [categoriePlaceholder, setCategoriePlaceholder] = useState("Loading...");
  const [lieuPlaceholder, setLieuPlaceholder] = useState("Loading...");

  /**
   * Fetch mission details from API when component mounts or id changes.
   */
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const mp = await missionService.getById(Number(missionId));
        setMissionPublic(mp);
        const editableMission = mapMissionPublicToMission(mp);
        setMission(editableMission);
        setOriginalMission(editableMission);
        setRegisteredCount(mp.volunteers_enrolled);
      } catch (err) {
        console.error(err);
        showAlert(t('error'), t('loadHomeError'));
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [missionId, t]);

  /**
   * Set placeholders for category and location once mission data is loaded.
   */
  useEffect(() => {
    if (mission?.category?.label) setCategoriePlaceholder(mission.category.label);
    else setCategoriePlaceholder(t('categoryNotSpecified'));
    
    if (mission?.location?.address) {
      setLieuPlaceholder(`${mission.location.address}, ${mission.location.zip_code}`);
    } else {
      setLieuPlaceholder(t('locationNotSpecified'));
    }
  }, [mission, t]);



  // ====== ALERT HANDLING ======
  const showAlert = useCallback((title: string, message: string) => {
    setAlert({ visible: true, title, message });
  }, []);

  const handleAlertClose = useCallback(() => {
    setAlert({ visible: false, title: '', message: '' });
  }, []);


  // ====== EDITING LOGIC ======

  /** Generic change handler for mission string/field updates. */
  const handleChange = (field: keyof Mission, value: any) => {
    if (mission) {
      setMission(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  /** Numeric input validation for capacity fields. */
  const handleNumericChange = (field: 'capacity_min' | 'capacity_max', value: string) => {
    if (value === '' || /^[0-9]+$/.test(value)) {
      handleChange(field, value === '' ? '' : parseInt(value, 10));
    }
  };

  /** Cancel edit and revert mission to original state. */
  const handleCancel = () => {
    setMission(originalMission);
    setIsEditing(false);
  };

  /**
   * Validate and save updated mission details.
   * Performs client-side validation before calling backend update API.
   */
  const handleSave = async () => {
    if (!mission) return;

    // === Validation ===
    if (!mission.name.trim()) return showAlert(t('error'), t('missingFields'));
    if (!mission.description.trim()) return showAlert(t('error'), t('missingFields'));

    const min = Number(mission.capacity_min);
    const max = Number(mission.capacity_max);
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) return showAlert(t('error'), t('capaPosErr'));
    if (min > max) return showAlert(t('error'), t('minMaxErr'));

    let startDate: Date, endDate: Date;
    try {
      startDate = new Date(mission.date_start);
      endDate = new Date(mission.date_end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error("Invalid date");
    } catch {
      return showAlert(t('error'), t('dateFmtErr'));
    }

    if (startDate >= endDate) return showAlert(t('error'), t('startEndErr'));

    // === Save request ===
    setIsSaving(true);
    const payload: MissionUpdate = {
      name: mission.name,
      description: mission.description,
      skills: mission.skills,
      date_start: startDate.toISOString(),
      date_end: endDate.toISOString(),
      capacity_min: min,
      capacity_max: max,
      image_url: mission.image_url,
    };

    try {
      const updatedMission = await associationService.updateMission(mission.id_mission, payload);
      setMission(updatedMission);
      setOriginalMission(updatedMission);
      setIsEditing(false);
      showAlert(t('success'), t('updateSuccess'));
    } catch (error) {
      console.error("Mission update failed:", error);
      showAlert(t('error'), t('updateFail'));
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete current mission after user confirmation.
   */
  const handleDelete = async () => {
    if (!mission) return;
    setIsDeleting(true);
    try {
      await associationService.deleteMission(mission.id_mission);
      showAlert(t('success'), t('deleteSuccess'));
      setConfirmDeleteVisible(false);
      if (router.canGoBack()) router.back();
      else router.replace('/(association)/home');
    } catch (error) {
      console.error("Mission deletion failed:", error);
      showAlert(t('error'), t('deleteFail'));
      setIsDeleting(false);
    }
  };

  // ====== RENDER LOGIC ======
  if (loading) {
    return <ActivityIndicator size="large" color={Colors.orange} style={{ flex: 1, justifyContent: 'center' }} />;
  }
  if (!mission) {
    return <Text style={styles.text}>{t('missionNotFound')}</Text>;
  }

  // Helpers to format dates for UI
  const formatDateForDisplay = (dateStr: string) => new Date(dateStr).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
  const formatDateForInput = (dateStr: string) => new Date(dateStr).toISOString().substring(0, 16);


  // ====== MAIN RETURN ======
  return (
    <>
      <AlertToast visible={alert.visible} title={alert.title} message={alert.message} onClose={handleAlertClose} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView style={styles.container}>
          <View style={{ paddingLeft: isSmallScreen ? 30 : 0 }}>
            <BackButton name_page={isEditing ? t('editMission') : t('missionDetails')} />
            {!isEditing && <Text style={styles.title}>{mission.name}</Text>}
          </View>

          {/* ===== EDIT MODE ===== */}
          {isEditing ? (
            <>
              {/* Title input */}
              <Text style={styles.label}>{t('missionTitleLabel')}</Text>
              <TextInput style={[styles.input, { fontSize: getFontSize(14), fontFamily }]} value={mission.name} onChangeText={(text) => handleChange("name", text)} />

              {/* Image URL */}
              <Text style={styles.label}>Image (URL)</Text>
              <TextInput style={[styles.input, { fontSize: getFontSize(14), fontFamily }]} value={mission.image_url || ''} onChangeText={(text) => handleChange("image_url", text)} />

              {/* Start / End Dates */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('startDateLabel')}</Text>
                  {Platform.OS === "web" ? (
                    <input
                      type="datetime-local"
                      value={formatDateForInput(mission.date_start)}
                      onChange={(e) => handleChange("date_start", e.target.value)}
                      style={{ width: "100%", padding: 10, fontSize: getFontSize(14), fontFamily }}
                    />
                  ) : (
                    <DatePickerField date={new Date(mission.date_start)} onChange={(date) => handleChange("date_start", date)} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('endDateLabel')}</Text>
                  {Platform.OS === "web" ? (
                    <input
                      type="datetime-local"
                      value={formatDateForInput(mission.date_end)}
                      onChange={(e) => handleChange("date_end", e.target.value)}
                      style={{ width: "100%", padding: 10, fontSize: getFontSize(14), fontFamily }}
                    />
                  ) : (
                    <DatePickerField date={new Date(mission.date_end)} onChange={(date) => handleChange("date_end", date)} />
                  )}
                </View>
              </View>

              {/* Non-editable info */}
              <Text style={styles.label}>{t('categoryLabel')}</Text>
              <Text style={styles.text}>{categoriePlaceholder}</Text>

              <Text style={styles.label}>{t('locationLabel')}</Text>
              <Text style={styles.text}>{lieuPlaceholder}</Text>

              {/* Capacity */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('minVolunteersLabel')}</Text>
                  <TextInput style={[styles.input, { fontSize: getFontSize(14), fontFamily }]} value={mission.capacity_min.toString()} onChangeText={(text) => handleNumericChange("capacity_min", text)} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('maxVolunteersLabel')}</Text>
                  <TextInput style={[styles.input, { fontSize: getFontSize(14), fontFamily }]} value={mission.capacity_max.toString()} onChangeText={(text) => handleNumericChange("capacity_max", text)} keyboardType="numeric" />
                </View>
              </View>

              {/* Skills and description */}
              <Text style={styles.label}>{t('requiredSkillsLabel')}</Text>
              <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top', fontSize: getFontSize(14), fontFamily }]} multiline value={mission.skills || ''} onChangeText={(text) => handleChange("skills", text)} />

              <Text style={styles.label}>{t('missionDescLabel')}</Text>
              <TextInput style={[styles.input, { height: 150, textAlignVertical: 'top', fontSize: getFontSize(14), fontFamily }]} multiline value={mission.description} onChangeText={(text) => handleChange("description", text)} />

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
                <TouchableOpacity style={[styles.buttonAction, { backgroundColor: Colors.gray, flex: 1 }]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonAction, { flex: 1 }]} onPress={handleSave} disabled={isSaving}>
                  <Text style={styles.buttonText}>{isSaving ? 'Saving...' : t('validate')}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ===== READ MODE ===== */
            <>
              <Image source={mission.image_url ? { uri: mission.image_url } : DEFAULT_MISSION_IMAGE} style={styles.image} resizeMode="cover" />

              {/* Mission details */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('startDateLabel')}</Text>
                  <Text style={styles.text}>{formatDateForDisplay(mission.date_start)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t('endDateLabel')}</Text>
                  <Text style={styles.text}>{formatDateForDisplay(mission.date_end)}</Text>
                </View>
              </View>

              <Text style={styles.label}>{t('categoryLabel')}</Text>
              <Text style={styles.text}>{categoriePlaceholder}</Text>

              <Text style={styles.label}>{t('locationLabel')}</Text>
              <Text style={styles.text}>{lieuPlaceholder}</Text>
              
              <Text style={styles.label}>{t('minVolunteersLabel')}</Text>
              <Text style={styles.text}>{`${mission.capacity_min} - ${mission.capacity_max} ${t('volunteer').toLowerCase()}s`}</Text>

              <Text style={styles.label}>{t('registeredVolunteers')}</Text>
              <Text style={styles.text}>{registeredCount}</Text>

              <Text style={styles.label}>{t('requiredSkillsLabel')}</Text>
              <Text style={styles.text}>{mission.skills}</Text>
              
              <Text style={styles.label}>{t('missionDescLabel')}</Text>
              <Text style={styles.text}>{mission.description}</Text>

              {/* Action buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginTop: 20 }}>
                <TouchableOpacity style={[styles.buttonAction, { backgroundColor: Colors.red, flex: 1 }]} onPress={() => setConfirmDeleteVisible(true)}>
                  <Text style={styles.buttonText}>{t('delete')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonAction, { flex: 1 }]} onPress={() => setIsEditing(true)}>
                  <Text style={styles.buttonText}>{t('editMission')}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <Modal visible={confirmDeleteVisible} transparent animationType="fade" onRequestClose={() => setConfirmDeleteVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20 }}>{t('confirmDeleteTitle')}</Text>
            <Text style={{ marginBottom: 20 }}>{t('confirmDeleteMsg')}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }}>
              <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
                <Text style={{ color: Colors.grayText }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
                <Text style={{ color: Colors.red }}>{isDeleting ? 'Deleting...' : t('delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
