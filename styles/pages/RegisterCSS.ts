import { Colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.colorCream,
    },
    columnLayout: {
        flexDirection: 'column',
    },
    // --- DESIGN PANNEAU GAUCHE (Cercles et Logo) ---
    leftPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
    },
    circleTopPurple: { width: 350, height: 350, backgroundColor: Colors.violet, top: -120, left: -100 },
    circleTopOrange: { width: 180, height: 180, backgroundColor: Colors.orange, top: '15%', left: -60 },
    circleBottomOrange: { width: 280, height: 280, backgroundColor: Colors.orange, bottom: -100, left: 20 },
    circleBottomPurple: { width: 200, height: 200, backgroundColor: Colors.violet, bottom: -50, left: 180 },
    mobileCircleTopRight: {
        position: 'absolute',
        top: -140,
        left: -140,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: Colors.orange,
    },
    mobileCircleBottomLeft: {
        position: 'absolute',
        top: -230,
        right: -170,
        width: 380,
        height: 380,
        borderRadius: 190,
        backgroundColor: Colors.violet,
    },
    logoImg: {
        width: '75%',
        height: 200,
        zIndex: 10,
    },

    // --- DESIGN PANNEAU DROIT (Formulaire) ---
    rightPanel: {
        flex: 1,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    subHeaderRow: {
        marginBottom: 25,
    },
    closeBtn: {
        marginLeft: 15,
    },
    closeBtnText: {
        fontSize: 35,
        color: Colors.orange,
        fontWeight: '300',
    },
    // --- L'AVATAR (Le cercle orange avec padding pour éviter le rognage) ---
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
        padding: 20, 
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    // --- CHAMPS DE SAISIE ---
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        backgroundColor: Colors.violet,
        borderRadius: 12,
        padding: 15,
        color: 'white',
        fontSize: 16,
        marginBottom: 12,
    },
    btn_file: {
        backgroundColor: Colors.violet,
        borderRadius: 30,
        marginBottom: 12,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    paperclipBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.violet,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        transform: [{ rotate: '45deg' }],
    },
    // --- BOUTON VALIDER ---
    submitBtn: {
        backgroundColor: Colors.orange,
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 20,
    },
    submitBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    bottomLinksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 6,
    },

    bottomText: {
        fontSize: 13,
        color: Colors.grayText,
    },

    bottomLinkText: {
        fontSize: 13,
        color: Colors.violet,
        textDecorationLine: 'underline',
    },
    footerLogo: {
        width: 52,
        height: 52,
        resizeMode: 'contain',
        marginTop: 28,
        marginBottom: 10,
        alignSelf: 'center'
    },
});