import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    card: {
        width: 260,
        backgroundColor: Colors.white,
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },

    imageContainer: {
        height: 120,
        width: "100%",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    categoryBadge: {
        position: "absolute",
        top: 10,
        left: 10,
    },

    heartButton: {
        position: "absolute",
        bottom: 10,
        left: 10,
        padding: 4,
    },

    peopleBadge: {
        position: "absolute",
        right: 10,
        top: 10,
        borderWidth: 1,
        borderColor: Colors.orange,
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    peopleText: {
        fontWeight: "700",
        color: Colors.black,
    },

    peopleIcon: {
        width: 18,
        height: 18,
    },

    content: {
        padding: 12,
        gap: 3,
    },

    title: {
        fontSize: 15,
        fontWeight: "800",
        color: Colors.black,
    },

    association: {
        fontSize: 12.5,
        color: Colors.grayPlaceholder,
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 2,
    },

    dateDot: {
        color: '#81458F',
        fontSize: 12,
    },

    dateText: {
        fontSize: 12.5,
        color: Colors.black,
    },

    location: {
        fontSize: 12.5,
        color: Colors.grayPlaceholder,
    },

    distanceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },

    distanceText: {
        fontSize: 14,
        fontWeight: "800",
        color: Colors.orange,
    },
});
