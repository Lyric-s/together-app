import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.darkerWhite,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 24,
    },
    missionsList: {
        gap: 16,
    },
    missionCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkerWhite,
        marginHorizontal: 10,
    },
    missionInfo: {
        flex: 1,
        gap: 8,
    },
    missionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 4,
    },
    missionDetail: {
        fontSize: 14,
        color: Colors.grayPlaceholder,
    },
    categoryContainer: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
    },
    buttonsContainer: {
        gap: 12,
        justifyContent: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 150,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    participantsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginLeft: 10,
    },
    imageSection: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    participantsIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    participantsText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center',
    },
});