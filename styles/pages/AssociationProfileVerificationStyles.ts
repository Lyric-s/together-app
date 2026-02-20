import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
    // --- Layout global ---
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
        paddingVertical: 24,
    },

    contentWrapper: {
        width: "100%",
        maxWidth: 1180,
        alignSelf: "center",
        paddingHorizontal: 40,
    },

    // --- Header ---
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 12,
        color: Colors.grayText,
        marginBottom: 24,
    },

    summaryRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
        width: "60%",
        maxWidth: 550,
        alignSelf: "flex-start",
    },


    summaryCard: {
        flex: 1,
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        justifyContent: "center",
    },

    summaryCardPending: {
        backgroundColor: "#FFF4E5",
    },

    summaryCardAccepted: {
        backgroundColor: "#E6F7EC",
    },

    summaryCardRejected: {
        backgroundColor: "#FFECEC",
    },

    summaryLabel: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
    },

    summaryLabelPending: {
        color: "#EA580C",
    },

    summaryLabelAccepted: {
        color: "#16A34A",
    },

    summaryLabelRejected: {
        color: "#DC2626",
    },

    summaryValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },

    // --- Colonne gauche ---
    leftColumn: {
        flex: 1,
    },

    // --- Filtres ---
    filtersRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        width: "70%",
        maxWidth: 850,
        alignSelf: "flex-start",
    },

    // barre de recherche rectangulaire
    searchWrapper: {
        flex: 1,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    searchInput: {
        fontSize: 13,
        color: "#111827",
        outlineWidth: 0,
        outlineColor: "transparent",
    },

    filterButton: {
        marginLeft: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: Colors.white,
    },

    filterButtonText: {
        fontSize: 12,
        color: "#111827",
    },

    resetButton: {
        marginLeft: 8,
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: "#EDE9FE",
    },

    resetButtonText: {
        fontSize: 12,
        color: "#4C1D95",
        fontWeight: "500",
    },

    // --- Tableau ---
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
        marginBottom: 4,
        width: "86%",
        maxWidth: 1000,
        alignSelf: "flex-start",
    },

    headerCell: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6B7280",
    },

    headerCellAsso: {
        flex: 1.4,
    },

    headerCellRNA: {
        flex: 0.9,
    },

    headerCellDoc: {
        flex: 1.4,
    },

    headerCellDate: {
        flex: 1,
    },

    headerCellStatus: {
        flex: 1.1,
    },

    headerCellActions: {
        flex: 0.5,
        textAlign: "right",
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",

        width: "86%",
        maxWidth: 1000,
        alignSelf: "flex-start",
    },

    cellText: {
        fontSize: 12,
        color: "#111827",
    },

    cellAsso: {
        flex: 1.4,
    },

    cellRNA: {
        flex: 0.9,
    },

    cellDoc: {
        flex: 1.4,
    },

    cellDate: {
        flex: 1,
    },

    cellStatus: {
        flex: 1.1,
    },

    cellActions: {
        flex: 0.5,
        alignItems: "flex-end",
    },

    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
    },

    statusBadgePending: {
        backgroundColor: "#FFEDD5",
    },

    statusBadgeAccepted: {
        backgroundColor: "#DCFCE7",
    },

    statusBadgeRejected: {
        backgroundColor: "#FEE2E2",
    },

    statusBadgeText: {
        fontSize: 11,
        fontWeight: "500",
        color: "#111827",
    },

    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#A855F7",
    },

    actionButtonText: {
        fontSize: 12,
        color: Colors.white,
        fontWeight: "500",
    },

    // --- Bloc détail / preview ---
    detailInfoBlock: {
        marginBottom: 16,
    },

    detailLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    detailLabel: {
        fontSize: 12,
        color: "#6B7280",
        flex: 1,
    },

    detailValue: {
        fontSize: 12,
        color: "#111827",
        flex: 1.2,
        textAlign: "right",
    },

    previewContainer: {
        marginBottom: 18,
    },

    previewPage: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingVertical: 22,
        paddingHorizontal: 16,
        backgroundColor: "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
    },

    previewTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },

    previewHint: {
        fontSize: 11,
        color: "#6B7280",
        textAlign: "center",
    },

    // --- Popup  ---
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    modalContainer: {
        width: 600,
        maxWidth: "100%",
        backgroundColor: Colors.white,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },

    modalHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    modalCloseButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
    },

    modalCloseButtonText: {
        fontSize: 18,
        color: "#4B5563",
        lineHeight: 18,
    },

    modalButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },

    rejectButton: {
        flex: 1,
        marginRight: 6,
        borderRadius: 999,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#F97373",
    },

    rejectButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.white,
    },

    acceptButton: {
        flex: 1,
        marginLeft: 6,
        borderRadius: 999,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#22C55E",
    },

    acceptButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.white,
    },
});

export default styles;
