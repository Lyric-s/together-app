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
import { useLanguage } from "@/context/LanguageContext";

interface FormInputProps {
  label: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  editable: boolean;
  required?: boolean;
  getFontSize: (size: number) => number;
  fontFamily?: string;
  [key: string]: any;
}

// --- MOCK DATA & TEST SWITCH ---
const USE_MOCK_DATA = __DEV__; // Passez à `false` pour utiliser l'API réelle

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

// Helper component for form inputs defined inside so it can access hooks
const FormInput = ({ label, value, onChangeText, editable, required = false, getFontSize, fontFamily, ...props }: FormInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: 'red' }}> *</Text>}
    </Text>
    <TextInput
      style={[
          styles.input, 
          !editable && styles.inputDisabled,
          { fontSize: getFontSize(14), fontFamily }
      ]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholderTextColor={Colors.gray}
      {...props}
    />
  </View>
);

/**
 * Renders the volunteer profile modification screen with view and edit modes, including editable form fields, profile image selection, and save/cancel flows.
 *
 * Supports a mock-data mode for development, validates required fields and optional password confirmation, and shows alerts for errors and success.
 *
 * @returns The JSX element for the profile modification page.
 */
export default function ProfilModificationPage() {
  const { user, refetchUser } = useAuth();
  const { t, getFontSize, fontFamily } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });

  const [formData, setFormData] = useState<VolunteerUpdate & { password?: string; confirmPassword?: string }>({});
  const [initialValues, setInitialValues] = useState<VolunteerUpdate>({});

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const volunteerData = USE_MOCK_DATA ? MOCK_VOLUNTEER_DATA : await volunteerService.getMe();
        const initialData: VolunteerUpdate = {
          first_name: volunteerData.first_name,
          last_name: volunteerData.last_name,
          email: volunteerData.user?.email,
          phone_number: volunteerData.phone_number,
          birthdate: volunteerData.birthdate,
          address: volunteerData.address,
          zip_code: volunteerData.zip_code,
          skills: volunteerData.skills,
          bio: volunteerData.bio,
        };
        setFormData({ ...initialData, password: '', confirmPassword: '' });
        setInitialValues(initialData);
        // setImageUri(volunteerData.photo_url || null);
      } catch (error) {
        console.error("Failed to load profile", error);
        showAlert(t('error'), t('profileLoadError'));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleAlertClose = () => setAlertModal(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, message: string) => setAlertModal({ visible: true, title, message });

  const handleEdit = () => setIsEditing(true);

  const handlePickImage = async () => {
    if (!isEditing) return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert(t('error'), t('mediaPermissionDenied'));
      return;
    }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Allows cropping
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
        console.error("Image Picker Error:", error);
        showAlert(t('error'), t('imagePickError'));
    }
  };

  const handleCancel = () => {
    setFormData({ ...initialValues, password: '', confirmPassword: '' });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const requiredFields: (keyof VolunteerUpdate)[] = ['first_name', 'last_name', 'email', 'phone_number', 'birthdate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        showAlert(t('error'), t('missingFields'));
        return;
      }
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showAlert(t('error'), t('pwdMismatch'));
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

    // const formDataPayload = new FormData();
    // formDataPayload.append('data', JSON.stringify(payload));
    // if (imageUri) {
    //    formDataPayload.append('file', { uri: imageUri, name: 'profile.jpg', type: 'image/jpeg' });
    // }

    if (USE_MOCK_DATA) {
      console.log("Données sauvegardées (simulation)");
      const { password, ...payloadNoPwd } = payload as VolunteerUpdate & { password?: string };
      setInitialValues({ ...initialValues, ...payloadNoPwd });
      setIsEditing(false);
      return;
    }

    if (!user?.id_volunteer) {
      showAlert(t('error'), t('sessionExpired'));
      return;
    }
    try {
      await volunteerService.updateMe(user.id_volunteer, payload);
      // await volunteerService.uploadAvatar(user.id_volunteer, imageUri); // Call your image upload service here
      await refetchUser();
      setFormData({ ...formData, password: '', confirmPassword: '' });
      const { password, ...payloadNoPwd } = payload as VolunteerUpdate & { password?: string };
      setInitialValues({ ...initialValues, ...payloadNoPwd });
      setIsEditing(false);
      showAlert(t('success'), t('profileUpdateSuccess'));
    } catch (error) {
      console.error("Failed to save profile", error);
      showAlert(t('error'), t('profileUpdateFail'));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.orange} />;
  }

  const commonInputProps = {
      editable: isEditing,
      getFontSize,
      fontFamily
  };

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
          <Text style={styles.headerTitle}>{t('myInfoTitle')}</Text>
        </View>
      </View>
      <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View>
          <View style={styles.formContainer}>
            <TouchableOpacity onPress={isEditing ? handlePickImage : undefined} disabled={!isEditing} activeOpacity={isEditing ? 0.7 : 1}>
              <ProfilePicture source={ imageUri ? { uri: imageUri } : require("@/assets/images/profil-picture.png")} size={120} />
              {isEditing && (
                  <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.orange, borderRadius: 15, padding: 5 }}>
                     {/* You can add a small camera icon here if you have one, or just a visual indicator */}
                     <Text style={{fontSize: 10, color: 'white'}}>✏️</Text>
                  </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <FormInput label={t('lastName')} value={formData.last_name} onChangeText={(val: string) => handleInputChange("last_name", val)} required {...commonInputProps}/>
            <FormInput label={t('firstName')} value={formData.first_name} onChangeText={(val: string) => handleInputChange("first_name", val)} required {...commonInputProps}/>
            <FormInput label={t('email')} value={formData.email} onChangeText={(val: string) => handleInputChange("email", val)} required keyboardType="email-address" {...commonInputProps}/>
            <FormInput label={t('phone')} value={formData.phone_number} onChangeText={(val: string) => handleInputChange("phone_number", val)} required keyboardType="phone-pad" {...commonInputProps}/>
            <FormInput label={t('birthdateEx')} value={formData.birthdate} onChangeText={(val: string) => handleInputChange("birthdate", val)} required {...commonInputProps}/>
            <FormInput label={t('address')} value={formData.address} onChangeText={(val: string) => handleInputChange("address", val)} {...commonInputProps}/>
            <FormInput label={t('zipCode')} value={formData.zip_code} onChangeText={(val: string) => handleInputChange("zip_code", val)} keyboardType="number-pad" {...commonInputProps}/>
            <FormInput label={t('skills')} value={formData.skills} onChangeText={(val: string) => handleInputChange("skills", val)} {...commonInputProps}/>
            <FormInput label={t('bio')} value={formData.bio} onChangeText={(val: string) => handleInputChange("bio", val)} multiline style={[ styles.input, !isEditing && styles.inputDisabled,  { height: 100 }, { fontSize: getFontSize(14), fontFamily }]} {...commonInputProps}/>

            {isEditing && (
              <>
                <FormInput label={t('newPwd')} value={formData.password} onChangeText={(val: string) => handleInputChange("password", val)} secureTextEntry placeholder={t('leaveEmpty')} placeholderTextColor={Colors.white} {...commonInputProps}/>
                <FormInput label={t('confirmPwd')} value={formData.confirmPassword} onChangeText={(val: string) => handleInputChange("confirmPassword", val)} secureTextEntry placeholderTextColor={Colors.white} {...commonInputProps}/>
              </>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <ButtonAuth text={t('edit')} onPress={handleEdit} />
          ) : (
            <View style={styles.editButtons}>
              <View style={{ flex: 1 }}><ButtonAuth text={t('cancel')} onPress={handleCancel} /></View>
              <View style={{ flex: 1 }}><ButtonAuth text={t('save')} onPress={handleSave} /></View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}