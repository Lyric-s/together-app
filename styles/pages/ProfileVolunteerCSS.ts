import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles1 = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: 20, // Padding global confortable
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 20,
        paddingLeft: 10, // Petit alignement visuel
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14, // Légèrement augmenté pour lisibilité (était 12)
        color: Colors.grayText,
    },
    
    // --- LAYOUT RESPONSIVE ---
    mainLayout: {
        flexDirection: 'row', // Par défaut : Desktop (Ligne)
        alignItems: 'flex-start',
        gap: 20, // Espacement entre colonne gauche et droite
        width: '100%',
        marginBottom: 20,
    },
    mainLayoutMobile: {
        flexDirection: 'column', // Mobile : Colonne
        alignItems: 'center', // Centre les éléments sur mobile
    },

    // --- ELEMENTS INTERNES ---
    sectionContainer: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 15,
        marginLeft: 5,
    },
    
    // Stats Card Styling
    statsCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row', // Alignement horizontal interne
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 10,
    },
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 20,
    },
    statsNumber: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.brightOrange,
    },
    
    // --- CALENDRIER (Styles conservés et nettoyés) ---
    calendar: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
    },
    // ... Garde tes autres styles de calendrier (calendarHeader, etc.) ici ...
});