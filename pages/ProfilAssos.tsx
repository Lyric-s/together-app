/**
 * @file ProfilAssos.tsx
 * @description Association profile screen.
 *              Fetches the current association profile from API and allows editing
 *              of description and address (with optional justification file).
 *              Responsive layout adapts for mobile or desktop screens.
 *              Uses the Association model and real API for updating.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import AlertToast from '@/components/AlertToast';
import ProfilCard from '@/components/ProfilCard';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/ProfilCSS';
import { Association } from '@/models/association.model';
import { associationService } from '@/services/associationService';
import { AssociationProfile, UserProfile } from '@/types/ProfileUser';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Utility function to convert Association → AssociationProfile
 */
const mapAssociationToProfile = (asso: Association, t: (key: any) => string): AssociationProfile => ({
    type: 'association',
    id_asso: asso.id_asso,
    id_user: asso.id_user,
    name: asso.name,
    phone_number: asso.phone_number,
    rna_code: asso.rna_code,
    company_name: asso.company_name,
    description: asso.description,
    address: asso.address,
    zip_code: asso.zip_code,
    country: asso.country,
    email: asso.user?.email ?? t('noInfo'),
    username: asso.user?.username ?? t('noInfo')
});


/**
 * Render the association profile screen with editable description and address.
 *
 * Fetches the current association profile on mount, displays a loading state, and presents editable fields for description and address. Validates required fields (name, phone number, RNA code) and zip code format before saving. Address changes can require an uploaded justification file. Saves update via the associationService, updates local state (including savedAddress and savedDescription), and surfaces success/error alerts. Layout adapts for very small screens by stacking ProfilCard above the detail cards and uses mapAssociationToProfile(profileUser, t) when rendering ProfilCard.
 *
 * @returns The component JSX for the association profile screen
 */
export default function ProfilAssos() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 900;
  const isVerySmallScreen = width < 610;
  const { t, getFontSize, fontFamily } = useLanguage();

  const [profileUser, setProfileUser] = useState<Association | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // ALERT TOAST STATE
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const handleAlertClose = useCallback(() => setAlertModal({ visible: false, title: '', message: '' }), []);
  const showAlert = useCallback((title: string, message: string) => setAlertModal({ visible: true, title, message }), []);

  // ADDRESS & DESCRIPTION EDIT STATE
  const [savedAddress, setSavedAddress] = useState({ address: '', zip_code: '' });
  const [savedDescription, setSavedDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);
  const [editingJustificationFile, setEditingJustificationFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  /**
   * Validate profile data before saving
   */
  const validateAssociationProfile = (data: Association): string | null => {
    if (!data.name?.trim()) return t('assoNameReq');
    if (!data.phone_number?.trim()) return t('phoneReq');
    if (!data.rna_code?.trim()) return t('rnaReq');
    if (data.zip_code && !/^\d{5}$/.test(data.zip_code)) return t('zipInvalid');
    return null;
  };

  /**
   * Fetch association profile from API on mount
   */
  useEffect(() => {
    const loadProfile = async () => {
      setIsPageLoading(true);
      try {
        const profileData = await associationService.getMe();
        if (profileData) {
          setProfileUser(profileData);
          setSavedAddress({ address: profileData.address, zip_code: profileData.zip_code });
          setSavedDescription(profileData.description);
        }
      } catch (error) {
        console.error("Error loading association profile:", error);
        showAlert(t('error'), t('loadError'));
      } finally {
        setIsPageLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Detect if address has changed
  useEffect(() => {
    if (!profileUser) return;
    setAddressChanged(
      profileUser.address !== savedAddress.address ||
      profileUser.zip_code !== savedAddress.zip_code
    );
  }, [profileUser?.address, profileUser?.zip_code, savedAddress]);

  /**
   * Save profile changes to API
   */
  const handleSave = async (data: Association) => {
    if (!profileUser) {
      showAlert(t('error'), t('profileInvalid'));
      return;
    }

    const error = validateAssociationProfile(data);
    if (error) {
      showAlert(t('error'), error);
      return;
    }

    try {
      const payload = {
        name: data.name ?? profileUser.name,
        phone_number: data.phone_number ?? profileUser.phone_number,
        rna_code: data.rna_code ?? profileUser.rna_code,
        company_name: data.company_name ?? profileUser.company_name,
        description: data.description ?? profileUser.description,
        address: data.address ?? profileUser.address,
        zip_code: data.zip_code ?? profileUser.zip_code,
        country: data.country ?? profileUser.country,
      };

      // Call real API PATCH /associations/{id}
      const updatedProfile = await associationService.update(profileUser.id_asso, payload);

      // Update local state
      setProfileUser(updatedProfile);
      setSavedAddress({ address: updatedProfile.address, zip_code: updatedProfile.zip_code });
      setSavedDescription(updatedProfile.description);
      setIsEditingAddress(false);
      setIsEditingDescription(false);
      setEditingJustificationFile(null);

      showAlert(t('success'), t('success'));
    } catch (error) {
      console.error(error);
      showAlert(t('error'), t('error'));
    }
  };

  /**
   * Description card rendering
   */
  const descriptionCard = () => (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { marginBottom: 16 }]}>{t('description')}</Text>
      <TextInput
        style={[styles.textArea, { fontSize: getFontSize(14), fontFamily }]}
        value={profileUser?.description || ''}
        editable={isEditingDescription}
        multiline
        onChangeText={(text) => profileUser && setProfileUser({ ...profileUser, description: text })}
      />

      {isEditingDescription ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, styles.cancelButton]}
            onPress={() => profileUser && setProfileUser({ ...profileUser, description: savedDescription }) || setIsEditingDescription(false)}
          >
            <Image style={styles.imageBtn} source={require('@/assets/images/return.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallButton, styles.saveButton]}
            onPress={() => profileUser && handleSave(profileUser)}
          >
            <Image style={styles.imageBtn} source={require('@/assets/images/validate.png')} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.smallButton, styles.editButton]} onPress={() => setIsEditingDescription(true)}>
          <Image style={styles.imageBtn} source={require('@/assets/images/edit.png')} />
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Address card rendering
   */
  const addressCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{t('address')}</Text>

      <Text style={styles.label}>{t('address')}</Text>
      <TextInput
        style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
        value={profileUser?.address || ''}
        editable={isEditingAddress}
        onChangeText={(text) => profileUser && setProfileUser({ ...profileUser, address: text })}
      />

      <Text style={styles.label}>{t('zipCode')}</Text>
      <TextInput
        style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
        value={profileUser?.zip_code || ''}
        editable={isEditingAddress}
        keyboardType="numeric"
        onChangeText={(text) => profileUser && setProfileUser({ ...profileUser, zip_code: text })}
      />

      {isEditingAddress ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, styles.cancelButton]}
            onPress={() => profileUser && setProfileUser({ ...profileUser, ...savedAddress }) || setIsEditingAddress(false)}
          >
            <Image style={styles.imageBtn} source={require('@/assets/images/return.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallButton, styles.saveButton]}
            onPress={() => {
              if (addressChanged && !editingJustificationFile) {
                showAlert(t('justifRequired'), t('justifMsg'));
                return;
              }
              handleSave(profileUser!);
            }}
          >
            <Image style={styles.imageBtn} source={require('@/assets/images/validate.png')} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.smallButton, styles.editButton]}
          onPress={() => {
            setIsEditingAddress(true);
            setEditingJustificationFile(null);
          }}
        >
          <Image style={styles.imageBtn} source={require('@/assets/images/edit.png')} />
        </TouchableOpacity>
      )}
    </View>
  );

  const rightColumnContent = () => (
    <>
      {descriptionCard()}
      {addressCard()}
    </>
  );

  if (isPageLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.brightOrange} />
      </View>
    );
  }

  return (
    <LinearGradient colors={[Colors.white, Colors.orangeVeryLight]} style={{ flex: 1 }}>
      <AlertToast visible={alertModal.visible} title={alertModal.title} message={alertModal.message} onClose={handleAlertClose} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, isSmallScreen ? { paddingLeft: 40 } : {}]}>{t('myProfile')}</Text>
        <Text style={[styles.text, isSmallScreen ? { paddingLeft: 40 } : {}]}>{t('allYourData')}</Text>

        {isVerySmallScreen ? (
          <View style={{ alignItems: 'center', gap: 20 }}>
            {profileUser && (
              <ProfilCard
                    userType="association"
                    userData={mapAssociationToProfile(profileUser, t)}
                    onSave={async (data: UserProfile) => {
                        // Vérifie que c’est bien une association
                        if (data.type !== 'association') return;

                        const profileData = data as AssociationProfile;

                        const payload: Association = {
                            ...profileUser!,
                            name: profileData.name,
                            phone_number: profileData.phone_number,
                            rna_code: profileData.rna_code,
                            company_name: profileData.company_name,
                            description: profileData.description || '',
                            address: profileData.address || '',
                            zip_code: profileData.zip_code || '',
                            country: profileData.country || '',
                        };

                        const updatedProfile = await associationService.update(profileUser!.id_asso, payload);
                        setProfileUser(updatedProfile);
                        setSavedAddress({ address: updatedProfile.address, zip_code: updatedProfile.zip_code });
                        setSavedDescription(updatedProfile.description);
                        showAlert(t('success'), t('success'));
                    }}
                    showAlert={showAlert}
                />
            )}
            {rightColumnContent()}
          </View>
        ) : (
          <View style={styles.desktopLayout}>
            <View style={styles.leftColumn}>
              {profileUser && (
                <ProfilCard
                    userType="association"
                    userData={mapAssociationToProfile(profileUser, t)}
                    onSave={async (data: UserProfile) => {
                        if (data.type !== 'association') return;

                        const profileData = data as AssociationProfile;

                        const payload: Association = {
                            ...profileUser!,
                            name: profileData.name,
                            phone_number: profileData.phone_number,
                            rna_code: profileData.rna_code,
                            company_name: profileData.company_name,
                            description: profileData.description || '',
                            address: profileData.address || '',
                            zip_code: profileData.zip_code || '',
                            country: profileData.country || '',
                        };

                        const updatedProfile = await associationService.update(profileUser!.id_asso, payload);
                        setProfileUser(updatedProfile);
                        setSavedAddress({ address: updatedProfile.address, zip_code: updatedProfile.zip_code });
                        setSavedDescription(updatedProfile.description);
                        showAlert(t('success'), t('success'));
                    }}
                    showAlert={showAlert}
                    />
                    )}

            </View>
            <View style={styles.rightColumn}>{rightColumnContent()}</View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}