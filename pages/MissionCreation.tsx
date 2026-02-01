import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Text } from '@/components/ThemedText';
// import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import DatePickerField from "@/components/DatePickerFields"; 
import {styles} from "@/styles/pages/CreationMissionStyle";
import {associationService} from "@/services/associationService";
import { router } from "expo-router";
import { categoryService } from "@/services/category.service";
import { Category } from "@/models/category.model";
import { Association } from "@/models/association.model";
import { useLanguage } from "@/context/LanguageContext";


/**
 * Render a form allowing an association to create and publish a mission.
 *
 * Loads available categories and the current association, validates form fields (title, description, category, dates, location, volunteer capacities), and submits a mission payload to the backend; on successful creation it navigates to the association home.
 *
 * @returns The React element representing the mission creation form UI.
 */
export default function MissionCreation() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null); 
  const [location, setLocation] = useState("");
  const [minVolunteers, setMinVolunteers] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [skills, setSkills] = useState("");
  const [association, setAssociation] = useState<Association>();
  const { t, getFontSize, fontFamily } = useLanguage();


  // --- Fetch categories from API ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        setCategories([]); // fallback
      }
    };
    loadCategories();
  }, []);

   // --- Fetch connected association ---
  useEffect(() => {
    const loadAssociation = async () => {
      try {
        const data = await associationService.getMe();
        if (data) setAssociation(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'association :", error);
      }
    };
    loadAssociation();
  }, []);

  const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

  const handlePublish = async () => {
  if (
    !title ||
    !description ||
    !selectedCategory ||
    !startDate ||
    !location ||
    !maxVolunteers ||
    !association
  ) {
    alert(t('fillRequired'));
    return;
  }

  if (endDate && endDate < startDate) {
    alert(t('dateOrderErr'));
    return;
  }

  const min = parseInt(minVolunteers || "0");
  const max = parseInt(maxVolunteers);

  if (isNaN(max) || max <= 0) {
    alert(t('maxVolErr'));
    return;
  }

  if (minVolunteers && min > max) {
    alert(t('minMaxVolErr'));
    return;
  }

  const now = new Date();
  if (startDate < now) {
    alert(t('pastDateErr'));
    return;
  }

  try {
    const payload = {
      name: title,
      description,
      skills,
      capacity_min: min,
      capacity_max: max,
      date_start: toIsoDate(startDate),
      date_end: endDate ? toIsoDate(endDate) : toIsoDate(startDate),
      // ⚠️ TODO : à brancher dynamiquement plus tard
      id_location: 1,
      category_ids: [Number(selectedCategory)],
      id_asso: Number(association?.id_asso),
    };

    const mission = await associationService.createMission(payload);

    alert(t('missionCreated'));
    console.log("Mission créée :", mission);

    // Go back to home page
    router.replace("/(association)/home");
  } catch (error) {
    console.error(error);
    alert(t('missionCreateErr'));
  }
};

  return (
    <ScrollView style={styles.container}>
      <View >
        <Text style={[styles.mainTitle, isSmallScreen ? { paddingLeft: 55 } : {}]}>{t('missionCreation')}</Text>
        <Text style={[styles.subtitle, isSmallScreen ? { paddingLeft: 55 } : {}]}>
          {t('fillInfo')}
        </Text>

        {/* SECTION 1 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('generalInfo')}</Text>

          <Text style={styles.label}>{t('missionTitleLabel')} *</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
            maxLength={100}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>{t('missionDescLabel')} *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { fontSize: getFontSize(14), fontFamily }]}
            maxLength={500}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>{t('categoryLabel')} *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              style={styles.picker}
            >
              <Picker.Item label={t('selectCategory')} value="" />

              {categories.map((c) => (
                <Picker.Item key={c.id_categ} label={c.label} value={c.id_categ} />
              ))}
            </Picker>
          </View>


          {/* <Text style={styles.label}>Image *</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>+ Importer une image</Text>
          </TouchableOpacity>
          {image && (
            <Text style={{ fontSize: 12, marginTop: 4 }}>{imageName}</Text>
          )} */}

        </View>

        {/* SECTION 2 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('practicalDetails')}</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('startDateLabel')} *</Text>
              <DatePickerField
                date={startDate}
                onChange={setStartDate}
              />
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>{t('endDateLabel')}</Text>
              <DatePickerField
                date={endDate}
                onChange={setEndDate}
              />
            </View>
          </View>

          <Text style={styles.label}>{t('locationLabel')} *</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
            value={location}
            onChangeText={setLocation}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('minVolunteersLabel')}</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
                keyboardType="numeric"
                value={minVolunteers}
                onChangeText={(t) => setMinVolunteers(t.replace(/[^0-9]/g, ""))}
              />
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>{t('maxVolunteersLabel')} *</Text>
              <TextInput
                style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
                keyboardType="numeric"
                value={maxVolunteers}
                onChangeText={(t) => setMaxVolunteers(t.replace(/[^0-9]/g, ""))}
              />
            </View>
          </View>

          <Text style={styles.label}>{t('requiredSkillsLabel')}</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
            value={skills}
            onChangeText={setSkills}
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonsRow}>
          
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishText}>{t('publishMission')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.requiredInfo}>* {t('requiredFields')}</Text>
      </View>
    </ScrollView>
  );
}

