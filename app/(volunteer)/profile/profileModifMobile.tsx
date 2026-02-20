import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BackButton from "@/components/BackButton";
import ProfilePicture from "@/components/ProfilPicture";
import ButtonAuth from "@/components/Button";
import { styles } from "@/styles/pages/ProfileModifMobileCSS";
import * as ImagePicker from "expo-image-picker";
import { volunteerService } from "@/services/volunteerService";
import { Volunteer, VolunteerUpdate } from "@/models/volunteer.model";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";
import { UserType } from '@/models/enums';
import AlertToast from "@/components/AlertToast";

// --- MOCK DATA & TEST SWITCH ---
const USE_MOCK_DATA = true; // Passez à `false` pour utiliser l'API réelle

// ... (MOCK_VOLUNTEER_DATA remains the same)
const MOCK_VOLUNTEER_DATA: Volunteer = {
    id_volunteer: 101,
    id_user: 900,
    first_name: "Thomas",
    last_name: "Anderson",
    phone_number: "0612345678",
    birthdate: "1999-03-31",
    address: "10 rue de la Matrice",
    zip_code: "75000",
    bio: "J'aime aider mon prochain et hacker des systèmes.",
    skills: "Informatique, Kung-fu, Jardinage",
    active_missions_count: 2,
    finished_missions_count: 42,
    user: {
      id_user: 900,
      username: "Neo_Béné",
      email: "neo@matrix.com",
      user_type: "volunteer" as UserType,
      date_creation: "2024-01-01"
    }
  };

// Helper component for form inputs
const FormInput = ({ label, value, onChangeText, editable, required = false, ...props }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: 'red' }}> *</Text>}
    </Text>
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholderTextColor={Colors.gray}
      {...props}
    />
  </View>
);

export default function ProfilModificationPage() {
  const { user, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });

  const [formData, setFormData] = useState<VolunteerUpdate & { password?: string; confirmPassword?: string }>({});
  const [initialValues, setInitialValues] = useState<VolunteerUpdate>({});

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const volunteerData = USE_MOCK_DATA ? MOCK_VOLUNTEER_DATA : await volunteerService.getMe();
        const initialData = {
          first_name: volunteerData.first_name,
          last_name: volunteerData.last_name,
          email: volunteerData.user?.email,
          phone_number: volunteerData.phone_number,
          birthdate: volunteerData.birthdate,
          address: volunteerData.address,
          zip_code: volunteerData.zip_code,
          skills: volunteerData.skills,
          bio: volunteerData.bio,
          password: '',
          confirmPassword: '',
        };
        setFormData(initialData);
        setInitialValues(initialData);
      } catch (error) {
        console.error("Failed to load profile", error);
        showAlert("Erreur", "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleAlertClose = () => setAlertModal(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, message: string) => setAlertModal({ visible: true, title, message });

  const handleEdit = () => setIsEditing(true);

  const handlePickImage = async () => { /* ... */ };

  const handleCancel = () => {
    setFormData(initialValues);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const requiredFields: (keyof VolunteerUpdate)[] = ['first_name', 'last_name', 'email', 'phone_number', 'birthdate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        showAlert("Erreur", `Le champ "${field}" est obligatoire.`);
        return;
      }
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showAlert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    const payload: VolunteerUpdate = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      birthdate: formData.birthdate,
      address: formData.address,
      zip_code: formData.zip_code,
      skills: formData.skills,
      bio: formData.bio,
    };

    if (formData.password) {
      (payload as any).password = formData.password;
    }

    if (USE_MOCK_DATA) {
      console.log("Données sauvegardées (simulation):", payload);
      setInitialValues({ ...initialValues, ...payload });
      setIsEditing(false);
      return;
    }

    if (!user?.id_volunteer) return;
    try {
      await volunteerService.updateMe(user.id_volunteer, payload);
      await refetchUser();
      setFormData({ ...formData, password: '', confirmPassword: '' });
      setInitialValues({ ...initialValues, ...payload });
      setIsEditing(false);
      showAlert("Succès", "Profil mis à jour !");
    } catch (error) {
      console.error("Failed to save profile", error);
      showAlert("Erreur", "La sauvegarde a échoué.");
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.orange} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <AlertToast visible={alertModal.visible} title={alertModal.title} message={alertModal.message} onClose={handleAlertClose} />
      <View style={styles.headerMobile}>
          <View style={styles.logoContainer}>
          <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
          />
          </View>
      </View>
      <View style={styles.header}>
        <BackButton name_page="" />
        <View style={styles.title}>
          <Image source={require("@/assets/images/edit_profil.png")} style={styles.editIcon} />
          <Text style={styles.headerTitle}>Mes informations</Text>
        </View>
      </View>
      <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View>
          <View style={styles.formContainer}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={isEditing ? 0.7 : 1}>
              <ProfilePicture source={ require("@/assets/images/profil-picture.png")} size={120} />
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <FormInput label="Nom" value={formData.last_name} onChangeText={(val: string) => handleInputChange("last_name", val)} editable={isEditing} required />
            <FormInput label="Prénom" value={formData.first_name} onChangeText={(val: string) => handleInputChange("first_name", val)} editable={isEditing} required />
            <FormInput label="Adresse mail" value={formData.email} onChangeText={(val: string) => handleInputChange("email", val)} editable={isEditing} required keyboardType="email-address" />
            <FormInput label="Téléphone" value={formData.phone_number} onChangeText={(val: string) => handleInputChange("phone_number", val)} editable={isEditing} required keyboardType="phone-pad" />
            <FormInput label="Date de naissance (AAAA-MM-JJ)" value={formData.birthdate} onChangeText={(val: string) => handleInputChange("birthdate", val)} editable={isEditing} required />
            <FormInput label="Adresse" value={formData.address} onChangeText={(val: string) => handleInputChange("address", val)} editable={isEditing} />
            <FormInput label="Code Postal" value={formData.zip_code} onChangeText={(val: string) => handleInputChange("zip_code", val)} editable={isEditing} keyboardType="number-pad" />
            <FormInput label="Compétences" value={formData.skills} onChangeText={(val: string) => handleInputChange("skills", val)} editable={isEditing} />
            <FormInput label="Bio" value={formData.bio} onChangeText={(val: string) => handleInputChange("bio", val)} editable={isEditing} multiline style={[ styles.input, !isEditing && styles.inputDisabled,  { height: 100 }]} />

            {isEditing && (
              <>
                <FormInput label="Nouveau mot de passe" value={formData.password} onChangeText={(val: string) => handleInputChange("password", val)} editable={isEditing} secureTextEntry placeholder="Laisser vide pour ne pas changer" placeholderTextColor={Colors.white} />
                <FormInput label="Confirmer le mot de passe" value={formData.confirmPassword} onChangeText={(val: string) => handleInputChange("confirmPassword", val)} editable={isEditing} secureTextEntry placeholderTextColor={Colors.white} />
              </>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <ButtonAuth text="Modifier" onPress={handleEdit} />
          ) : (
            <View style={styles.editButtons}>
              <View style={{ flex: 1 }}><ButtonAuth text="Annuler" onPress={handleCancel} /></View>
              <View style={{ flex: 1 }}><ButtonAuth text="Sauvegarder" onPress={handleSave} /></View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}