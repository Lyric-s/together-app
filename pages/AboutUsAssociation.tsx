import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, Platform, useWindowDimensions, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import { styles } from '@/styles/pages/AboutAssociationStyle';
import { Association } from '@/models/association.model';
import { associationService } from '@/services/associationService';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from "@/context/AuthContext";
import AlertToast from '@/components/AlertToast';

/**
 * Displays details for an association identified by the `id` route parameter, handling loading, error, and not-found states.
 *
 * @returns A React element that renders a loading indicator while fetching, an error or not-found message when appropriate, or the association details (header, description, and information fields) when available.
 */
export default function AboutUsAssociation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSmallScreenWeb = isWeb && width < 900;
  const { userType } = useAuth();
  const { t } = useLanguage();
    
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  useEffect(() => {
    const rawId = Array.isArray(id) ? id[0] : id;

    if (!rawId) {
      setError(true);
      setLoading(false);
      setAssociation(null);
      return;
    }

    const numericId = Number(rawId);
    if (isNaN(numericId)) {
        setError(true);
        setLoading(false);
        setAssociation(null);
        return;
    }

    const fetchAssociation = async () => {
        setLoading(true);
        setError(false);
        setAssociation(null);
        try {
            const data = await associationService.getById(numericId);
            if (!data) throw new Error('Association not found');
            setAssociation(data);
        } catch (e) {
            console.error("Erreur chargement association:", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    fetchAssociation();
  }, [id]);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ visible: true, title, message });
  }, []);

  if (loading) {
    return (
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color={Colors.orange} />
        </View>
    );
  }

  if (!association) {
    return (
        <View>
            <View style={[
                styles.header,
                isSmallScreenWeb && { paddingLeft: 70 },
                isWeb && { paddingTop: 25 }
            ]}>
                <BackButton name_page={t('back')} />
            </View>
            <View>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    {error ? t('loadAssoError') : t('assoNotFound')}
                </Text>
            </View>
        </View>
    );
  }
  const handleReport = () => {
    Alert.alert(t('report'), `${t('reportConcerning')} ${association?.name}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]} >
        <AlertToast 
            visible={toast.visible} 
            title={toast.title} 
            message={toast.message} 
            onClose={() => setToast(t => ({ ...t, visible: false }))}
        />

        <View style={[
            styles.header,
            !isWeb && { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 50, paddingHorizontal: 10 },
            isWeb && { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 25, gap: 2 },
            isSmallScreenWeb && { paddingLeft: 60 }
        ]}>
            <View style={!isWeb ? { position: 'absolute', left: 0, zIndex: 10 } : {}}>
                <BackButton name_page="" />
            </View>
            <Text 
                style={[ 
                    styles.headerTitle,
                    isWeb ? { fontSize: 24, marginLeft: 0 } : {},
                    !isWeb ? { textAlign: 'center' } : {}
                ]}
                numberOfLines={2}
            >
                {association.name}
            </Text>
             {/* REPORT BUTTON */}
            {userType === 'volunteer' && (
      <TouchableOpacity 
        style={{ position: 'absolute', right: 10, top: isWeb ? 25 : 12 }} 
        onPress={handleReport}
      >
        <Image 
          source={require("@/assets/images/report.png")} 
          style={{ width: 24, height: 24, tintColor: Colors.orange }} 
        />
      </TouchableOpacity>
    )}
        </View>
        {/* Content */}
        <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, isWeb && styles.scrollContentWeb, !isWeb && { paddingTop: 0 }]}
              >
            <View style={styles.content}>
          {/* Description box */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('description')}</Text>
            <Text style={styles.text}>
                {association.description || t('noDescription')}
            </Text>
          </View>

          {/* Informations box */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('informations')}</Text>

            <View style={{gap: 10}}>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>{t('nameLabel')}</Text> {association.name}
                </Text>

                {association.address ? (
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>{t('addressLabel')}</Text> {association.address}
                    </Text>
                ) : null}

                {association.zip_code ? (
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>{t('zipCodeLabel')}</Text> {association.zip_code}
                    </Text>
                ) : null}

                {association.phone_number ? (
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>{t('phoneLabel')}</Text> {association.phone_number}
                    </Text>
                ) : null}
            </View>
          </View>
          </View>
        </ScrollView>
    </View>
  );
}