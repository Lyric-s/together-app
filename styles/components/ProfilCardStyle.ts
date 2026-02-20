import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors'

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 15,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 20,
        marginBottom: 20,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    photoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.whiteLittleGray,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    labelContainer: {
        flex: 1,
        paddingRight: 10,
        justifyContent: 'center',
    },
    inputWrapper: {
        flex: 2,
    },
    label: {
        fontWeight: "600",
        fontSize: 13,
        color: Colors.violet,
        textAlign: 'left',
    },
    text: {
        fontSize: 14,
        paddingVertical: 8,
        textAlign: 'center',
        color: Colors.black,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.violet,
        opacity: 0.5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0', // Couleur plus douce
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8, // Zone de touche plus confortable
        fontSize: 14,
        width: '100%',
        backgroundColor: '#FAFAFA', // Léger fond pour indiquer champ éditable
    },
    // Boutons
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Écarte les boutons
        marginTop: 30,
        width: '100%',
        gap: 10, // Espace entre les boutons (React Native 0.71+)
    },
    buttonWrapper: {
        flex: 1, // Chaque bouton prend 50% de l'espace disponible
        alignItems: 'center',
    },
    responsiveButton: {
        width: '100%', // Le bouton remplit son wrapper
        maxWidth: 140, // Mais ne dépasse pas 140px sur grands écrans
        height: 40,    // Hauteur standard tactile
    },
    // Boutons
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        width: '100%',
        gap: 10,
    },
    buttonWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    responsiveButton: {
        width: '100%',
        maxWidth: 140,
        height: 40,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    editIcon: {
        fontSize: 18,
    },
});