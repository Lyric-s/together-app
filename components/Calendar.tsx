// components/Calendar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { styles } from '@/styles/components/CalendarCSS'; // Assurez-vous d'avoir ce fichier CSS
import { volunteerService } from '@/services/volunteerService';
import { Mission } from '@/models/mission.model';
import { Colors } from '@/constants/colors';

interface MissionDay {
    id: string;
    time: string;
    title: string;
    image?: any;
}

const weekDays = ['D', 'L', 'M', 'Me', 'J', 'V', 'S'];
const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [missionsToday, setMissionsToday] = useState<MissionDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [noEventsMessage, setNoEventsMessage] = useState(false);

    // Charger les missions quand on change de jour sélectionné
    const loadMissionsForDay = useCallback(async (date: Date) => {
        setLoading(true);
        setNoEventsMessage(false);
        setMissionsToday([]);

        try {
            // Format YYYY-MM-DD pour l'API
            const dateStr = date.toISOString().split('T')[0]; 
            
            // APPEL API RÉEL ICI
            const missions = await volunteerService.getMyMissions(dateStr);

            if (missions && missions.length > 0) {
                const formattedMissions: MissionDay[] = missions.map((m: Mission) => ({
                    id: m.id_mission.toString(),
                    time: new Date(m.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    title: m.name,
                    image: m.image_url ? { uri: m.image_url } : undefined
                }));
                setMissionsToday(formattedMissions);
            } else {
                setNoEventsMessage(true);
            }
        } catch (error) {
            console.error("Erreur chargement calendrier", error);
            setNoEventsMessage(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialisation au chargement
    useEffect(() => {
        loadMissionsForDay(selectedDay);
    }, []); // Au montage uniquement

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today); // Remet le calendrier sur le mois actuel
        setSelectedDay(today);  // Sélectionne le jour d'aujourd'hui
        loadMissionsForDay(today); // Recharge les données
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const handleDayPress = (dayNum: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
        setSelectedDay(newDate);
        loadMissionsForDay(newDate);
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const isSelected = (dayNum: number) => {
        return dayNum === selectedDay.getDate() &&
               currentMonth.getMonth() === selectedDay.getMonth() &&
               currentMonth.getFullYear() === selectedDay.getFullYear();
    };

    const isToday = (dayNum: number) => {
        const today = new Date();
        return dayNum === today.getDate() &&
               currentMonth.getMonth() === today.getMonth() &&
               currentMonth.getFullYear() === today.getFullYear();
    };

    return (
        <View style={styles.calendar}>
            {/* Header Mois */}
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth('prev')}><Text style={styles.monthArrow}>{'<'}</Text></TouchableOpacity>
                <Text style={styles.calendarMonth}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
                <TouchableOpacity onPress={() => changeMonth('next')}><Text style={styles.monthArrow}>{'>'}</Text></TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={goToToday} 
              style={{
                  position: 'absolute',
                  right: 0,
                  backgroundColor: Colors.veryLightOrange,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  marginTop: 10,
                  marginRight: 20,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: Colors.orange
              }}
            >
              <Text style={{ color: Colors.orange, fontSize: 10, fontWeight: 'bold' }}>
                Aujourd'hui
              </Text>
            </TouchableOpacity>
            {/* Jours Semaine */}
            <View style={styles.calendarWeekDays}>
                {weekDays.map((day, i) => <Text key={i} style={styles.weekDay}>{day}</Text>)}
            </View>

            {/* Grille Jours */}
            <View style={styles.calendarDays}>
                {Array.from({ length: 35 }, (_, i) => {
                    const dayNum = i - firstDayOfMonth + 1;
                    const isValid = dayNum > 0 && dayNum <= daysInMonth;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.calendarDay,
                                !isValid && styles.calendarDayEmpty,
                                isToday(dayNum) && styles.calendarDayToday,
                                isSelected(dayNum) && styles.calendarDaySelected,
                            ]}
                            onPress={() => isValid && handleDayPress(dayNum)}
                            disabled={!isValid}
                        >
                            <Text style={[styles.calendarDayText, isSelected(dayNum) && { color: 'white', fontWeight: 'bold' }]}>
                                {isValid ? dayNum : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Liste Missions du jour */}
            <View style={styles.missionsSection}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.orange} />
                ) : noEventsMessage ? (
                    <Text style={styles.noEventsText}>Rien de prévu ce jour.</Text>
                ) : (
                    missionsToday.map((mission) => (
                        <View key={mission.id} style={styles.calendarEvent}>
                             {/* Exemple de style pour l'événement - adapter selon CalendarCSS */}
                            <Text style={styles.eventTime}>{mission.time}</Text>
                            <Text style={styles.eventTitle}>{mission.title}</Text>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
}