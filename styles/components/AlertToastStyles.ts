import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 19999,
    },
    toastContent: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        maxWidth: 300,
        shadowColor: Colors.black,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    toastTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.red,
        marginBottom: 8,
    },
    toastMessage: {
        fontSize: 14,
        color: Colors.black,
        lineHeight: 18,
        marginBottom: 4,
    },
    toastClose: {
        fontSize: 18,
        color: Colors.red,
        position: 'absolute',
        top: 8,
        right: 12,
    },
}) 