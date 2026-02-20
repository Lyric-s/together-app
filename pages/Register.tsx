import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Platform, ActivityIndicator, useWindowDimensions } from 'react-native';
import SwitchButton from '../components/SwitchButton'; 
import { styles } from '../styles/pages/RegisterCSS';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context';
import { authService } from '@/services/authService';
import AlertToast from '@/components/AlertToast';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '@/constants/colors';
import Cross from '@/components/Cross';

/**
 * Renders the registration screen for both volunteer ("Bénévole") and association sign‑up flows.
 *
 * The component provides forms for shared and type‑specific fields, client‑side validation, optional
 * document attachment for associations, and submission handling that registers the user and navigates
 * to the appropriate home route.
 *
 * @returns The registration screen UI component for volunteer or association sign‑up.
 */
export default function Register() {
    const router = useRouter();
    const { login, refetchUser } = useAuth();
    const { userType } = useLocalSearchParams<{ userType: string }>();
    const [userTypeTab, setUserTypeTab] = useState(userType === 'association' ? 'Association' : 'Bénévole');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, title: '', message: '' });
    
    const isWeb = Platform.OS === 'web';

    // Common Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [zip_code, setZip_code] = useState('');
    const [phone_number, setPhone_number] = useState('');
    
    // Volunteer Fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');

    // Association Fields
    const [assoName, setAssoName] = useState('');
    const [rnaCode, setRnaCode] = useState('');
    const [assoCompanyName, setAssoCompanyName] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');

    const [attachment, setAttachment] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

    useEffect(() => {
        if (userType === 'association') setUserTypeTab('Association');
        else if (userType === 'volunteer') setUserTypeTab('Bénévole');
    }, [userType]);

    const handleClose = () => {
        router.replace('/(guest)/home');
    };

    const showToast = (title: string, message: string) => {
        setToast({ visible: true, title, message });
    };

    const handleAuthSwitch = (tab: string) => {
        if (tab === 'Connexion') {
            router.replace('/(auth)/login');
        }
    };

    const handleUserTypeSwitch = (tab: string) => {
        setUserTypeTab(tab);
    };


    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAttachment(result.assets[0]);
            }
        } catch (err) {
            console.log("Erreur selection fichier", err);
            showToast("Erreur", "La sélection du fichier a échoué.");
         }

    };

    const validateForm = () => {
        // 1. Common Validation (User)
        if (!username.trim()) return "Le nom d'utilisateur est requis.";
        if (!email.trim()) return "L'adresse email est requise.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "L'adresse email n'est pas valide.";
        if (!phone_number.trim()) return "Le numéro de téléphone est requis.";
        if (!password) return "Le mot de passe est requis.";
        if (!confirmPassword) return "La confirmation du mot de passe est requise.";
        if (password !== confirmPassword) return "Les mots de passe ne correspondent pas.";

        // 2. Specific Validation
        if (userTypeTab === 'Bénévole') {
            if (!lastName.trim()) return "Le nom est requis.";
            if (!firstName.trim()) return "Le prénom est requis.";
            if (!birthdate.trim()) return "La date de naissance est requise.";
            if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) return "Le format de date doit être YYYY-MM-DD.";
            // Bio & Skills are optional for the volunteer
        }    
        else { // Association
            if (!assoName.trim()) return "Le nom de l'association est requis.";
            if (!assoCompanyName.trim()) return "Le nom de la compagnie est requis.";
            if (!rnaCode.trim()) return "Le code RNA est requis.";
            if (!country.trim()) return "Le pays est requis.";
            if (!description.trim()) return "La description est requise.";
            if (!address.trim()) return "L'adresse est requise.";
            if (!zip_code.trim()) return "Le code postal est requis.";
            //if (!attachment) return "Le récépissé préfectoral est obligatoire.";
        }

        return null;
    };

    const handleRegister = async () => {
        const error = validateForm();
        if (error) {
            showToast("Champs manquants", error);
            return;
        }
        setLoading(true);
        try {
            const baseData = {
                username, email, password, phone_number, address, zip_code,
                type: userTypeTab === 'Bénévole' ? 'volunteer' : 'association'
            };

            let payload: any = { ...baseData };

            if (userTypeTab === 'Bénévole') {
                payload = { ...payload, first_name: firstName, last_name: lastName, birthdate, bio, skills };
            } else {
                payload = { 
                    ...payload, 
                    name: assoName, 
                    company_name: assoCompanyName, 
                    rna_code: rnaCode, 
                    country, 
                    description,
                };
                // Note: File upload likely requires FormData instead of JSON
                // payload.file = attachment;
            }
            const response = await authService.register(payload);
            await refetchUser();
            console.log("Inscription lancée");
            router.replace(`/(${payload.type})/home` as any);
        } catch (e: any) {
            console.error("ERREUR DÉTAILLÉE D'INSCRIPTION:", JSON.stringify(e, null, 2));

            let errorMessage = "Une erreur inconnue est survenue.";

            if (e.response) {
                const serverError = e.response.data;
                if (serverError && serverError.detail) {
                    errorMessage = serverError.detail;
                } else {
                    errorMessage = `Erreur du serveur : ${e.response.status}`;
                }
            } else if (e.request) {
                errorMessage = "Erreur Réseau : Impossible de contacter le serveur. Vérifiez l'URL de l'API et si le backend est bien démarré.";
            } else {
                errorMessage = e.message;
            }

            showToast("Échec de l'inscription", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
        <View style={[styles.container, { backgroundColor: Colors.white}]} >
        <AlertToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast({...toast, visible: false})} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContainer]} bounces={false} keyboardShouldPersistTaps="handled">
            <View style={[styles.mainContainer, !isWeb && styles.columnLayout]}>
                
                {/* --- LEFT PANEL --- */}
                {isWeb && (
                    <View style={styles.leftPanel}>
                        <View style={[styles.circle, styles.circleTopPurple]} />
                        <View style={[styles.circle, styles.circleTopOrange]} />
                        <View style={[styles.circle, styles.circleBottomOrange]} />
                        <View style={[styles.circle, styles.circleBottomPurple]} />
                        
                        <Image 
                            source={require('../assets/images/splash_art.png')} 
                            style={styles.logoImg} 
                            resizeMode="contain" 
                        />
                    </View>
                )}

                {/* --- RIGHT PANEL --- */}
                <View style={styles.rightPanel}>
                    {!isWeb && <View style={styles.mobileCircleTopRight} />}
                    {!isWeb && <View style={styles.mobileCircleBottomLeft} />}
                    
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <View style={[
                            styles.headerRow, 
                            !isWeb && { marginTop: 10, justifyContent: 'flex-end' },
                            isWeb && { justifyContent: 'flex-end', width: '100%' }
                        ]}>
                            {isWeb &&
                                <>
                                    <SwitchButton 
                                        variant="auth" 
                                        value={"Inscription"}
                                        onChange={handleAuthSwitch}
                                    />
                                    <Cross
                                        onClose={handleClose}
                                        containerStyle={{ position: 'relative', top: 0, left: 0 }}
                                    />
                                </>
                            }
                            {!isWeb &&
                                <Cross
                                    onClose={handleClose}
                                    containerStyle={{ position: 'absolute', top: -20, left: -20 }}
                                />   
                            }
                        </View>
                        {isWeb && (
                            <View style={[styles.subHeaderRow, { justifyContent: 'flex-start' }]}>
                                <SwitchButton 
                                    variant="userType" 
                                    value={userTypeTab}
                                    onChange={handleUserTypeSwitch}
                                />
                            </View>
                        )}
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 400 }}>
                        <View style={styles.avatarCircle}>
                            <Image 
                                source={require('../assets/images/user.png')} 
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.form}>
                            <TextInput 
                                placeholder="Username *" 
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.input}
                                value={username} onChangeText={setUsername}
                            />
                            {userTypeTab === 'Association' ? (
                                <>
                                    <TextInput 
                                        placeholder="Nom de l'association *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={assoName} onChangeText={setAssoName}
                                    />
                                    <TextInput 
                                        placeholder="Nom de la compagnie *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={assoCompanyName} onChangeText={setAssoCompanyName}
                                    />
                                    <View style={[styles.fileInputContainer, {justifyContent: 'space-between'}]}>
                                        <TextInput 
                                            placeholder="Code RNA *" 
                                            placeholderTextColor="rgba(255,255,255,0.7)"
                                            style={styles.input}
                                            value={rnaCode} onChangeText={setRnaCode}
                                        />
                                        <TouchableOpacity style={styles.btn_file} onPress={handlePickDocument}>
                                            <Image source={require('../assets/images/attachment-file.png')} 
                                                style={{width: 20, height: 20}}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput 
                                        placeholder="Description *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        numberOfLines={4}
                                        multiline
                                        value={description} onChangeText={setDescription}
                                    />
                                    <TextInput 
                                        placeholder="Pays *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={country} onChangeText={setCountry}
                                    />
                                </>
                                ) : (
                                <>
                                    <TextInput 
                                        placeholder="Nom *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={lastName} onChangeText={setLastName}
                                    />
                                    <TextInput 
                                        placeholder="Prénom *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={firstName} onChangeText={setFirstName}
                                    />
                                    <TextInput 
                                        placeholder="Date de naissance (YYYY-MM-DD) *" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={birthdate} onChangeText={setBirthdate}
                                    />
                                    <TextInput 
                                        placeholder="Bio" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={bio} onChangeText={setBio}
                                    />
                                    <TextInput 
                                        placeholder="Compétences" 
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={styles.input}
                                        value={skills} onChangeText={setSkills}
                                    />
                                </>
                            )}
                            <TextInput placeholder={userTypeTab === 'Association' ? "Adresse *" : "Adresse"} placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} value={address} onChangeText={setAddress}/>
                            <TextInput placeholder={userTypeTab === 'Association' ? "Code Postal *" : "Code Postal"} placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input}  value={zip_code} onChangeText={setZip_code}  />
                            <TextInput placeholder="N°Téléphone *" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} keyboardType="numeric"  value={phone_number} onChangeText={setPhone_number} />
                            <TextInput placeholder="Adresse mail *" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                            <TextInput placeholder="Mot de passe *" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} secureTextEntry={true}  value={password} onChangeText={setPassword} />
                            <TextInput placeholder="Confirmer mot de passe *" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} secureTextEntry={true}  value={confirmPassword} onChangeText={setConfirmPassword} />

                            <TouchableOpacity 
                                style={[styles.submitBtn, loading && { opacity: 0.6 }]} 
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>S'inscrire</Text>
                                )}
                            </TouchableOpacity>
                            
                            { !isWeb &&
                            <View style={styles.bottomLinksContainer}>
                                <Text style={styles.bottomText}> Un compte ?</Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.bottomLinkText}>
                                        Se connecter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            }
                            { !isWeb &&
                                <Image
                                    source={require('@/assets/images/logo-together.png')}
                                    style={styles.footerLogo}
                                />
                            }
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </View>
        </KeyboardAvoidingView>
    );
}