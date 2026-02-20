// pages/HomeGuest.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import MissionVolunteerCard from '@/components/MissionVolunteerCard';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/pages/AccountWithoutCoCSS';
import { Mission } from '@/models/mission.model';
import { missionService } from '@/services/missionService';
import Footer from '@/components/footer';

/**
 * Render the guest home page showing recent missions and CTAs for volunteers and associations.
 *
 * Displays a responsive, scrollable UI that fetches and shows up to three recent missions with loading and error states, and provides buttons to register as a volunteer or as an association (association registration opens on web only; non-web shows an alert).
 *
 * @returns The JSX element for the guest home screen containing the mission list, loading/error handling, and registration CTAs.
 */
export default function HomeGuest() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  const isSmallScreen = width < 900;

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await missionService.getAll();
      setMissions(data ?? []);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les missions pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handlePressMission = (missionId: number) => {
    console.log('Mission pressed:', missionId);
    router.push(`/(guest)/search/mission/${missionId}`);
  };

  const handleJoinRegister = () => {
    router.push('/(auth)/register?userType=volunteer');
  };

  const handleJoinRegisterAssociation = () => {
    if (isWeb) {
        router.push('/(auth)/register?userType=association');
    } else {
        Alert.alert(
            "Inscription Association",
            "Pour des raisons administratives (envoi de documents), l'inscription d'une association se fait uniquement sur notre site web.",
            [
                { text: "D'accord", style: "default" }
            ]
        );
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}> 
      
      {/* Header Mobile Only */}
      {isMobile && (
        <View style={styles.headerMobile}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
            isMobile ? { alignItems: 'center', paddingVertical: 5 } : {}
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* LISTE DES MISSIONS */}
        <View style={isMobile ? styles.sectionMobile : styles.sectionWeb}>
          <View style={styles.sectionHeader}>
            <Text style={isMobile ? styles.sectionTitle : [styles.sectionTitleWeb, isSmallScreen && {paddingLeft: 35}]}>
               {isMobile ? 'Récent' : 'Missions récentes'}
            </Text>
            
            {isMobile && (
              <TouchableOpacity onPress={() => router.push('/(guest)/search')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            {loading ? (
              <View style={{ minHeight: '60%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.orange} />
              </View>
            
            ) : error ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'gray', textAlign: 'center', marginBottom: 10 }}>
                    {error}
                </Text>
                <TouchableOpacity 
                  onPress={loadMissions}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.orange,
                    borderRadius: 20
                  }}
                >
                  <Text style={{ color: Colors.orange, fontWeight: '600' }}>
                    ↻ Recharger
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
            <View style={isMobile ? {alignItems:'center'} : styles.missionsGrid}>
              {missions.length === 0 ? (
                <Text style={{ color: 'gray', fontStyle: 'italic', padding: 20 }}>Aucune mission disponible.</Text>
              ) : (
                missions.slice(0, 3).map((mission) => (
                  <View key={mission.id_mission} style={styles.cardWrapper}>
                    <MissionVolunteerCard
                      mission={mission}
                      onPressMission={() => handlePressMission(mission.id_mission)}
                    />
                  </View>
                ))
              )}
            </View>
            )}
          </View>
        </View>

        {/* CTA BÉNÉVOLE */}
        <View style={isMobile ? styles.ctaSectionMobile : styles.ctaSectionWeb}>
          <Text style={isMobile ? styles.ctaTitleMobile : styles.ctaTitleWeb}>
            Vous êtes un(e) bénévole, ou vous souhaitez en devenir un(e) !
          </Text>
          <Text style={isMobile ? styles.ctaDescriptionMobile : styles.ctaDescriptionWeb}>
            Envie d'agir et de donner un peu de votre temps ?{'\n'}
            <Text style={styles.boldText}>Together</Text> vous met en lien avec des associations proches de chez vous.
          </Text>
          <TouchableOpacity 
            style={isMobile ? styles.ctaButtonMobile : styles.ctaButtonWeb} 
            onPress={handleJoinRegister}
          >
            <Text style={isMobile ? styles.ctaButtonText : styles.ctaButtonTextWeb}>
              REJOINDRE EN TANT QUE BÉNÉVOLE
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA ASSOCIATION */}
        <View style={[
            isMobile ? styles.ctaSectionMobile : styles.ctaSectionWeb, 
            styles.ctaSectionLavender
        ]}>
          <Text style={isMobile ? styles.ctaTitleMobile : styles.ctaTitleWeb}>
            Vous êtes une association et vous cherchez des bénévoles !
          </Text>
          <Text style={isMobile ? styles.ctaDescriptionMobile : styles.ctaDescriptionWeb}>
            Besoin de renfort pour vos actions ?{'\n'}
            Avec <Text style={[styles.boldText, { color: Colors.inputBackground }]}>Together</Text>, publiez facilement vos missions.
          </Text>
          <TouchableOpacity 
            style={[
                isMobile ? styles.ctaButtonMobile : styles.ctaButtonWeb, 
                isMobile ? styles.ctaButtonLavender : styles.ctaButtonBlueWeb
            ]}
            onPress={handleJoinRegisterAssociation}
          >
            <Text style={isMobile ? styles.ctaButtonText : styles.ctaButtonTextWeb}>
              REJOINDRE EN TANT QU'ASSOCIATION
            </Text>
          </TouchableOpacity>
        </View>

        {isWeb && <Footer />}

      </ScrollView>
    </View>
  );
}