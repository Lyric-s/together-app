import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MissionAdminAssosCard from "@/components/MissionAdminAssosCard";
import { styles } from "@/styles/pages/AssosHomePageStyle";
import { associationService } from "@/services/associationService";
import { Mission } from "@/models/mission.model";
import { Notification } from "@/models/notif.model";
import { mapMissionPublicToMission } from "@/utils/mission.utils";
import { Colors } from "@/constants/colors";

/**
 * Represents a group of notifications displayed under the same date section.
 */
type NotificationSection = {
  title: string;
  data: Notification[];
};

/**
 * AssosHomePage
 *
 * Association home page layout composed of two main sections:
 *
 * - Left column (35%):
 *   Displays upcoming missions using MissionAdminAssosCard components.
 *
 * - Right column (65%):
 *   Displays notifications grouped by date.
 */
export default function AssosHomePage() {
  const [upcomingMissions, setUpcomingMissions] = useState<Mission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load Missions
        const missionsData = await associationService.getMyMissions();
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today for comparison

        const filteredMissions = missionsData
          .map(mapMissionPublicToMission)
          .filter(m => {
            if (!m.date_end) return true;
            const endDate = new Date(m.date_end);
            endDate.setHours(23, 59, 59, 999);
            return endDate >= now;
          });
        setUpcomingMissions(filteredMissions);

        // Load Notifications
        const notifsData = await associationService.getNotifications(0, 50);
        setNotifications(notifsData || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'accueil :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Returns the display title for a notification section based on its date.
  const getSectionTitle = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Aujourd’hui";
    if (isSameDay(date, yesterday)) return "Hier";

    return date.toLocaleDateString("fr-FR");
  };
  
  // Group notifications by date
  const notificationSections = Object.values(
    notifications.reduce<Record<string, NotificationSection>>((acc, notif) => {
      const date = new Date(notif.created_at);
      const title = getSectionTitle(date);

      if (!acc[title]) {
        acc[title] = { title, data: [] };
      }

      acc[title].data.push(notif);
      return acc;
    }, {})
  ).sort((a, b) => {
    // Basic sort: put "Aujourd'hui" first, then "Hier", then others by date desc
    if (a.title === "Aujourd’hui") return -1;
    if (b.title === "Aujourd’hui") return 1;
    if (a.title === "Hier") return -1;
    if (b.title === "Hier") return 1;
    return 0; 
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.buttonBackgroundViolet} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* LEFT COLUMN – MISSIONS (35%) */}
      <View style={styles.leftColumn}>
        <Text style={styles.pageTitle}>Accueil</Text>
        <Text style={styles.columnTitle}>Missions à venir</Text>

        <ScrollView showsVerticalScrollIndicator={true}>
          {upcomingMissions.length > 0 ? (
            upcomingMissions.map((mission) => (
              <MissionAdminAssosCard
                key={mission.id_mission} 
                mission={mission}              
              />
            ))
          ) : (
            <Text style={{ marginTop: 20, color: '#666', fontStyle: 'italic' }}>
              Aucune mission à venir.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* RIGHT COLUMN – NOTIFICATIONS (65%) */}
      <View style={styles.rightColumn}>
        <Text style={styles.columnTitle}>Notifications</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {notificationSections.length > 0 ? (
            notificationSections.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>

                {section.data.map((notif) => (
                  <View
                    key={notif.id_notification}
                    style={[styles.notificationCard, styles.notifInfo]}
                  >
                    <Text style={styles.notificationText}>
                      {notif.message}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={{ marginTop: 20, color: '#666', fontStyle: 'italic' }}>
              Aucune notification.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}


 