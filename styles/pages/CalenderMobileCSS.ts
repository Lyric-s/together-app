import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerMobile: {
        backgroundColor: Colors.white,
        padding: 10,
    },
    logoContainer: {
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backBtn: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    editIcon: {
        width: 34,
        height: 34,
        resizeMode: "contain",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: Colors.black,
        marginLeft: 10,
        backgroundColor: Colors.lavender,
        padding: 15, 
        borderRadius : 10,
    },

});