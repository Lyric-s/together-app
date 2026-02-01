import { useState, useEffect } from 'react';
import { styles } from '@/styles/components/ProfilCardStyle';
import { ScrollView, Image, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ThemedText';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from './ImageButton';
import { UserType } from '@/context/AuthContext';
import { UserProfile, AdminProfile, VolunteerProfile, AssociationProfile } from '@/types/ProfileUser';
import { useLanguage } from '@/context/LanguageContext';

type ProfileLabels = {
    username?: string;
    last_name?: string;
    first_name?: string;
    birthdate?: string;
    email?: string;
    password: string;
    confirmPassword: string;
    phone_number?: string;
    skills?: string;
    address?: string;
    zip_code?: string;
    bio?: string;
    name?: string;
    country?: string;
    rna_code?: string;
    company_name?: string;
};

type InputBlockProps = {
    label: string;
    value?: string;
    isEditing: boolean;
    onChange: (text: string) => void; // On précise ici que la fonction attend une string
    secure?: boolean;
    multiline?: boolean;
    required?: boolean;
};

type Props = {
    userType: UserType;
    userData: UserProfile; // Data of the user from the database
    onSave?: (data: UserProfile) => Promise<void>; // Function to save into the database
    showAlert: (title: string, message: string) => void;
};

const DEFAULT_PHOTO = require('@/assets/images/profil-picture.png');

const isAdmin = (data: UserProfile): data is AdminProfile => data.type === 'admin';
const isVolunteer = (data: UserProfile): data is VolunteerProfile => data.type === 'volunteer';
const isAsso = (data: UserProfile): data is AssociationProfile => data.type === 'association';

/**
 * Render and manage an editable profile card for admin, volunteer, or association users.
 *
 * The component displays profile fields appropriate to the user's subtype, allows switching
 * between view and edit modes, supports picking a profile image, performs per-type validation,
 * and invokes `onSave` with a sanitized UserProfile payload when changes are saved.
 *
 * @param userType - The current user subtype used to derive labels and visible fields
 * @param userData - The source UserProfile shown and edited in the card
 * @param onSave - Optional callback invoked with the final UserProfile payload after successful validation
 * @param showAlert - Function used to present user-facing alert messages for validation or errors
 * @returns A React element rendering the profile card UI
 */
export default function ProfilCard({
    userType,
    userData,
    onSave,
    showAlert,
}: Props) {
    const { width } = useWindowDimensions();
    const contentPadding = width < 380 ? 15 : 30;
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useLanguage();

    const getLabels = (uType: UserType): ProfileLabels => {
        switch (uType) {
            case 'volunteer':
                return {
                    last_name: t('lastName'),
                    first_name: t('firstName'),
                    username: t('username'),
                    phone_number: t('phone'),
                    birthdate: t('birthdateEx'),
                    email: t('email'),
                    address: t('address'),
                    zip_code: t('zipCode'),
                    skills: t('skills'),
                    bio: t('bio'),
                    password: t('password'),
                    confirmPassword: t('confirmPwd'),
                };
            case 'association':
                return {
                    company_name: t('companyName'),
                    name: t('lastName'),
                    username: t('username'),
                    email: t('email'),
                    phone_number: t('phone'),
                    rna_code: t('rnaCode'),
                    password: t('password'),
                    confirmPassword: t('confirmPwd'),
                };
            case 'admin':
                return {
                    last_name: t('lastName'),
                    first_name: t('firstName'),
                    username: t('username'),
                    email: t('email'),
                    password: t('password'),
                    confirmPassword: t('confirmPwd'),
                };
            default:
                return {
                    last_name: t('lastName'),
                    password: t('password'),
                    confirmPassword: t('confirmPwd'),
                };
        }
    };

    const labels = getLabels(userType);

    // Original data (immutable copy)
    const [originalData, setOriginalData] = useState<UserProfile>(userData);
    // Editable data (working copy)
    const [formData, setFormData] = useState<UserProfile>(userData);
    
    const handleEdit = () => {
        // Creation of copy of original data
        setFormData({ ...originalData });
        setIsEditing(true);
    }

    // Update the data when userData change (ex: after a refresh of database)
    useEffect(() => {
        setOriginalData(userData);
        if (!isEditing) setFormData({ ...userData });
    }, [userData]);

    const handleChange = (field: string, value: string) => {
        // Only working copy
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImagePick = async () => {
        // Ask permission to access gallery
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            showAlert(t('permDenied'), t('permDeniedMsg'));
            return;
        }

        // Open gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], //ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            setFormData(prev => ({ ...prev, picture: { uri: result.assets[0].uri } }));
        }
    };

    const handleCancel = () => {
        // Cancel changes: restore original data
        setFormData({ ...originalData, password: '', confirmPassword: '' });
        setIsEditing(false);
        console.log('Modifications annulées, données restaurées');
    };

    const handleSubmit = async () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/;

            const isPasswordChanged = formData.password && formData.password.trim() !== '';
            let passwordPayload = {};

            if (isPasswordChanged) {
                const pass = formData.password || '';
                const confirm = formData.confirmPassword || '';

                if (pass.length < 10) {
                    return showAlert(t('error'), t('pwdLengthErr'));
                }

                if (pass !== confirm) {
                    return showAlert(t('error'), t('pwdConfirmErr'));
                }

                passwordPayload = { password: pass };
            }

            let finalPayload: UserProfile | null = null;

            if (isVolunteer(formData)) {
                // Validation Specific Volunteer
                if (!formData.last_name?.trim() || !formData.first_name?.trim() || !formData.email?.trim() || !formData.birthdate?.trim() || !formData.phone_number?.trim()) {
                    return showAlert(t('error'), t('missingFields'));
                }
                if (!emailRegex.test(formData.email.trim())) {
                    return showAlert(t('error'), t('emailInvalid'));
                }
                const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!birthdateRegex.test(formData.birthdate.trim())) {
                    return showAlert(t('error'), t('dateFormatErr'));
                }
                const dateObj = new Date(formData.birthdate.trim());
                if (isNaN(dateObj.getTime())) {
                    return showAlert(t('error'), t('dateInvalid'));
                }
                const cleanPhone = formData.phone_number.replace(/[\s\-\(\)]/g, '');
                if (!phoneRegex.test(cleanPhone)) {
                    return showAlert(t('error'), t('phoneInvalid'));
                }

                finalPayload = {
                    ...formData, // Keep ID, type, etc.
                    last_name: formData.last_name.trim(),
                    first_name: formData.first_name.trim(),
                    email: formData.email.trim(),
                    phone_number: formData.phone_number.replace(/\s/g, ''),
                    birthdate: formData.birthdate.trim(),
                    address: (formData.address ?? '').trim(),
                    zip_code: (formData.zip_code ?? '').trim(),
                    skills: (formData.skills ?? '').trim(),
                    bio: (formData.bio ?? '').trim(),
                    ...passwordPayload
                };
            }
            else if (isAdmin(formData)) {
                // Validation Specific Admin
                if (!formData.last_name?.trim() || !formData.first_name?.trim() || !formData.email?.trim()) {
                    return showAlert(t('error'), t('missingFields'));
                }
                if (!emailRegex.test(formData.email.trim())) {
                    return showAlert(t('error'), t('emailInvalid'));
                }

                finalPayload = {
                    ...formData,
                    last_name: formData.last_name.trim(),
                    first_name: formData.first_name.trim(),
                    email: formData.email.trim(),
                    ...passwordPayload
                };
            }
            else if (isAsso(formData)) {
                // Validation Association
                if (!formData.name?.trim() || !formData.company_name?.trim() || !formData.rna_code?.trim() || !formData.phone_number?.trim() || !formData.email?.trim()) {
                    return showAlert(t('error'), t('missingFields'));
                }
                if (!emailRegex.test(formData.email.trim())) {
                    return showAlert(t('error'), t('emailInvalid'));
                }
                const cleanPhone = formData.phone_number.replace(/[\s\-\(\)]/g, '');
                if (!phoneRegex.test(cleanPhone)) {
                    return showAlert(t('error'), t('phoneInvalid'));
                }
                finalPayload = {
                    ...formData,
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    company_name: formData.company_name.trim(),
                    rna_code: formData.rna_code.trim(),
                    phone_number: (formData.phone_number || '').replace(/\s/g, ''),
                    ...passwordPayload
                };
            }
            
            if (finalPayload && onSave) {
                await onSave(finalPayload);
                setOriginalData(finalPayload);
                setFormData({...finalPayload, password: '', confirmPassword: ''});
                setIsEditing(false);
            }

        } catch (error) {
            showAlert(t('error'), t('saveError'));
            console.error(error);
        }
    };

    return (
        <ScrollView
            style={[styles.card, { width: '90%' }]}
            contentContainerStyle={[styles.scrollContent, { padding: contentPadding }]}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
        >
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={isEditing ? handleImagePick : undefined} disabled={!isEditing}>
                    <Image source={formData.picture || DEFAULT_PHOTO} style={styles.photo} />
                    {isEditing && (
                        <View style={styles.editIconContainer}><Text style={styles.editIcon}>📷</Text></View>
                    )}
                </TouchableOpacity>
            </View>
            
            {(isAdmin(formData) || isVolunteer(formData)) && (
                <>
                    {labels.last_name && (isEditing || formData.last_name) && (
                        <InputBlock label={labels.last_name} value={formData.last_name} isEditing={isEditing} onChange={(t) => handleChange('last_name', t)} required />
                    )}
                    {labels.first_name && (isEditing || formData.first_name) && (
                        <InputBlock label={labels.first_name} value={formData.first_name} isEditing={isEditing} onChange={(t) => handleChange('first_name', t)} required/>
                    )}
                </>
            )}

            {(isAdmin(formData) || isAsso(formData) || isVolunteer(formData)) && (
                <>
                    {labels.username && (
                        <InputBlock label={labels.username} value={formData.username} isEditing={false} onChange={() => {}} />
                    )}
                    {labels.email && (isEditing || formData.email) && (
                        <InputBlock label={labels.email} value={formData.email} isEditing={isEditing} onChange={(t) => handleChange('email', t)} required />
                    )}
                </>
            )}

            {isVolunteer(formData) && (
                <>
                    {labels.birthdate && (isEditing || formData.birthdate) && (
                        <InputBlock label={labels.birthdate} value={formData.birthdate} isEditing={isEditing} onChange={(t) => handleChange('birthdate', t)} required />
                    )}
                    {labels.phone_number && (isEditing || formData.phone_number) && (
                        <InputBlock label={labels.phone_number} value={formData.phone_number} isEditing={isEditing} onChange={(t) => handleChange('phone_number', t)} required />
                    )}
                    {labels.address && (isEditing || formData.address) && (
                        <InputBlock label={labels.address} value={formData.address} isEditing={isEditing} onChange={(t) => handleChange('address', t)} />
                    )}
                    {labels.zip_code && (isEditing || formData.zip_code) && (
                        <InputBlock label={labels.zip_code} value={formData.zip_code} isEditing={isEditing} onChange={(t) => handleChange('zip_code', t)} />
                    )}
                    {/* Multilines */}
                    {labels.skills && (isEditing || formData.skills) && (
                        <InputBlock label={labels.skills} value={formData.skills} isEditing={isEditing} onChange={(t) => handleChange('skills', t)} multiline />
                    )}
                    {labels.bio && (isEditing || formData.bio) && (
                        <InputBlock label={labels.bio} value={formData.bio} isEditing={isEditing} onChange={(t) => handleChange('bio', t)} multiline />
                    )}
                </>
            )}

            {isAsso(formData) && (
                <>
                    {labels.company_name && (isEditing || formData.company_name) && (
                        <InputBlock label={labels.company_name} value={formData.company_name} isEditing={isEditing} onChange={(t) => handleChange('company_name', t)} required />
                    )}
                    {labels.name && (isEditing || formData.name) && (
                        <InputBlock label={labels.name} value={formData.name} isEditing={isEditing} onChange={(t) => handleChange('name', t)} required />
                    )}
                    {labels.rna_code && (isEditing || formData.rna_code) && (
                        <InputBlock label={labels.rna_code} value={formData.rna_code} isEditing={isEditing} onChange={(t) => handleChange('rna_code', t)} required />
                    )}
                    {labels.phone_number && (isEditing || formData.phone_number) && (
                        <InputBlock label={labels.phone_number} value={formData.phone_number} isEditing={isEditing} onChange={(t) => handleChange('phone_number', t)} required />
                    )}
                </>
            )}

            {isEditing && (
                <>
                    <InputBlock label={labels.password} value={formData.password || ''} isEditing={true} onChange={(t) => handleChange('password', t)} secure />
                    <InputBlock label={labels.confirmPassword} value={formData.confirmPassword || ''} isEditing={true} onChange={(t) => handleChange('confirmPassword', t)} secure />
                </>
            )}
            
            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <View style={styles.buttonWrapper}>
                            <CustomButton image={require('@/assets/images/return.png')} onPress={handleCancel} style={styles.responsiveButton} />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <CustomButton image={require('@/assets/images/validate.png')} onPress={handleSubmit} style={styles.responsiveButton} />
                        </View>
                    </>
                ) : (
                    <View style={{ width: '100%', alignItems: 'flex-end', marginTop: 20 }}>
                        <CustomButton image={require('@/assets/images/edit.png')} onPress={handleEdit} style={{width:150, height:36}} />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const InputBlock = ({ label, value, isEditing, onChange, secure, multiline, required }: InputBlockProps) => {
    const hasValue = value && value.trim().length > 0;
    const { getFontSize, fontFamily } = useLanguage();

    if (!isEditing && !hasValue) {
        return null;
    }

    return (
    <View style={styles.inputRow}>
        <View style={styles.labelContainer}>
            <Text style={styles.label}>
                {label}
                {isEditing && required && <Text style={{ color: 'red' }}> *</Text>}
            </Text>
        </View>
        <View style={styles.inputWrapper}>
            {isEditing ? (
                <TextInput
                    style={[
                        styles.input,
                        multiline && { minHeight: 100 },
                        { fontSize: getFontSize(14), fontFamily }
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={label + (required ? '*' : '')}
                    secureTextEntry={secure}
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                />
            ) : (
                <Text style={styles.text}>{secure ? '********' : value}</Text>
            )}
            <View style={styles.separator} />
        </View>
    </View>
    );
};