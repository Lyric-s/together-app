import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Colors.darkerWhite,
    },

    mainBackground: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    mainScroll: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 60,
    },

    contentWrapper: {
        width: "100%",
        maxWidth: 1180,
        alignSelf: "center",
        paddingHorizontal: 28,
        paddingVertical: 24,
    } as any,

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1E1E1E",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.grayText,
    },

    column: { flexDirection: "column" },

    kpiRow: {
        marginTop: 18,
        flexDirection: "row",
        gap: 18,
    },

    kpiCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
    },

    kpiIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#EDE9FF",
        alignItems: "center",
        justifyContent: "center",
    },

    kpiIcon: { width: 22, height: 22, resizeMode: "contain" },
    kpiTextWrap: { flex: 1 },
    kpiLabel: { fontSize: 11, color: Colors.grayText },

    kpiValue: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: "700",
        color: "#1E1E1E",
    },


    block: {
        flex: 1,
        maxWidth: 520,
        width: "100%",
        alignSelf: "flex-start",
    },

    blockTitle: {
        marginTop: 18,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "700",
        color: "#343C6A",
    },

    chartsRow: {
        marginTop: 6,
        flexDirection: "row",
        gap: 22,
        alignItems: "stretch",
    },


    chartCard: {
        borderRadius: 14,
        padding: 18,
        height: 300,
        justifyContent: "center",
    },

    chartOrange: { backgroundColor: "#FFF1E8" },
    chartPurple: { backgroundColor: "#EDE9FF" },

    bottomRow: {
        marginTop: 14,
        flexDirection: "row",
        gap: 22,
        alignItems: "stretch",
    },


    pendingCard: {
        borderRadius: 14,
        padding: 18,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },

    pendingValue: {
        marginTop: 6,
        fontSize: 56,
        fontWeight: "800",
        color: "#2D1C56",
    },

    pendingBtn: {
        marginTop: 12,
        paddingHorizontal: 30,
        paddingVertical: 9,
        borderRadius: 6,
    },

    pendingBtnText: {
        color: Colors.white,
        fontWeight: "700",
        fontSize: 12,
        textTransform: "lowercase",
    },

    pendingOrange: { backgroundColor: "#FFF1E8" },
    pendingPurple: { backgroundColor: "#EDE9FF" },

    btnOrange: { backgroundColor: Colors.brightOrange },
    btnPurple: { backgroundColor: "#5B3CFF" },
});

export default styles;
