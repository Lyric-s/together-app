import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({

    eventTitle: {
        fontSize: 14,
        color: Colors.black,
        flex: 1,
    },
    calendar: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        maxWidth: '100%',
        flex: 1,
    },
    calendarHeader: {
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: 16,
        flexDirection: "row",
    },
    monthArrow: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.black,
        paddingHorizontal: 12,
    },
    calendarMonth: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        backgroundColor: Colors.brightOrange,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    calendarWeekDays: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: Colors.brightOrange,
    },
    calendarDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: `${100 / 7}%`,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayEmpty: {
        opacity: 0.3,
    },
    calendarDayText: {
        fontSize: 14,
        color: Colors.black,
    },
    calendarEvent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.bottomBackground,
        borderRadius: 8,
        gap: 8,
    },
    eventTime: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
    },
  
    calendarDayToday: {
        backgroundColor: Colors.brightOrange,
        borderWidth: 2,
        borderColor: Colors.white,
        borderRadius: 20,
    },
    calendarDaySelected: {
        backgroundColor: Colors.bottomBackground,
        borderWidth: 2,
        borderColor: Colors.brightOrange,
        borderRadius: 20,
    },
    missionsSection: {
        marginTop: 16,
        padding: 12,
        minHeight: 20,
    },
    noEventsText: {
        fontSize: 14,
        color: Colors.grayPlaceholder,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    missionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 8,
        backgroundColor: Colors.bottomBackground,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 5,
        alignSelf: 'flex-start',
        
    },
    missionTime: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.brightOrange,
        minWidth: 50,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.grayPlaceholder,
        textAlign: 'center',
    },
    
    
});