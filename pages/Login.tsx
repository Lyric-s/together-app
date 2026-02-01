import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Platform, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ThemedText';
import SwitchButton from '../components/SwitchButton';
import { styles } from '../styles/pages/RegisterCSS';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context';
import { authService } from '@/services/authService';
import AlertToast from '@/components/AlertToast';
import { Colors } from '@/constants/colors';
import Cross from '@/components/Cross';
import { UserType } from '@/models/enums'
import { storageService } from '@/services/storageService';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Render the login screen, handle credential input and validation, perform authentication, persist session tokens, refresh user context, and navigate to the appropriate post-login route.
 *
 * @returns The JSX element representing the login screen
 */
export default function Login() {
    const router = useRouter();
    const { login, refetchUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, title: '', message: '' });
    const { t, getFontSize, fontFamily } = useLanguage();

    const isWeb = Platform.OS === 'web';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        router.replace('/(guest)/home');
    };

    const showToast = (title: string, message: string) => {
        setToast({ visible: true, title, message });
    };

    const handleAuthSwitch = (tab: string) => {
        if (tab === 'register') {
            router.push('/(auth)/register');
        }
    };

    const handleLogin = async () => {
        if (!username.trim()) {
            showToast(t('error'), t('usernameReq'));
            return;
        }
        if (!password) {
            showToast(t('error'), t('passwordReq'));
            return;
        }
        setLoading(true);
        try {
            const response = await authService.login(username, password);
            await storageService.saveTokens(response.access_token, response.refresh_token);
            if(response.user_type) await storageService.setItem('user_type', response.user_type);
            await refetchUser();
            console.log("✅ Connexion réussie");
            const user_type:UserType = response.user_type;
            if (user_type) {
                // Cas spécial pour l'admin
                if (user_type === UserType.ADMIN) {
                    router.replace('/(admin)/dashboard');
                } else {
                    // Cas pour 'volunteer' et 'association'
                    router.replace(`/(${user_type})/home`);
                }
            } else {
                // Sécurité : si l'API ne retourne pas le type, on redirige vers une page par défaut
                showToast(t('redirectError'), t('userTypeUnknown'));
                router.replace('/(guest)/home');
            }
        } catch (e: any) {
            console.error(e);
            showToast(t('loginFail'), t('badCredentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: Colors.white}]} >
                <AlertToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast({...toast, visible: false})} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContainer]} bounces={false} keyboardShouldPersistTaps="handled">
                    <View style={[styles.mainContainer, !isWeb && styles.columnLayout]}>

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
                                                labelLeft={t('registerBtn')}
                                                labelRight={t('loginBtn')}
                                                valueLeft="register"
                                                valueRight="login"
                                                value={"login"}
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
                                        placeholder={`${t('username')} *`}
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
                                        value={username} onChangeText={setUsername}
                                        accessibilityLabel={t('username')}
                                        accessibilityHint={t('enterUsername')}

                                    />
                                    <TextInput
                                        placeholder={`${t('password')} *`}
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
                                        secureTextEntry={true}
                                        value={password}
                                        onChangeText={setPassword}
                                        accessibilityLabel={t('password')}
                                        accessibilityHint={t('enterPassword')}
                                    />

                                    <TouchableOpacity
                                        style={styles.submitBtn}
                                        onPress={handleLogin}
                                        accessibilityLabel={t('login')}
                                        accessibilityHint="Appuyez pour vous connecter"
                                        accessibilityRole="button"
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.submitBtnText}>{t('login')}</Text>
                                        )}
                                    </TouchableOpacity>

                                    { !isWeb &&
                                        <View style={styles.bottomLinksContainer}>
                                            <Text style={styles.bottomText}> {t('noAccount')}</Text>
                                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                                <Text style={styles.bottomLinkText}>
                                                    {t('register')}
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