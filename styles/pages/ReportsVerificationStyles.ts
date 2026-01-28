/**
 * ReportsVerificationStyles
 *
 * Styles pour la page admin des signalements.
 */

import { Platform, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

const reportStyles = StyleSheet.create({
    // ----- Layout / Page -----
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
        paddingBottom: 40,
    },

    contentWrapper: {
        width: "100%",
        maxWidth: 1180,          // ✅ même largeur que documents
        alignSelf: "center",
        paddingHorizontal: 40,    // ✅ même padding
        paddingVertical: 24,
    },

    title: {
        fontSize: 24,             // ✅ même taille
        fontWeight: "700",
        color: "#111827",         // ✅ même couleur
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 12,
        color: Colors.grayText,
        marginBottom: 24,         // ✅ même spacing
    },

    summaryRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
        width: "60%",        // ✅ même emplacement (à gauche + pas trop large)
        maxWidth: 550,
        alignSelf: "flex-start",
    },

    summaryCard: {
        flex: 1,
        borderRadius: 20,    // ✅ même radius
        paddingVertical: 18,
        paddingHorizontal: 20,
        justifyContent: "center",
    },

// ✅ mêmes couleurs que Documents
    summaryCardOrange: {
        backgroundColor: "#FFF4E5",
    },
    summaryCardPurple: {
        backgroundColor: "#E6F7EC",
    },
    summaryCardGreen: {
        backgroundColor: "#FFECEC",
    },

    summaryCardLabel: {
        fontSize: 13,        // ✅ même taille label
        fontWeight: "600",
        marginBottom: 6,
    },

    summaryLabelOrange: {
        color: "#EA580C",
    },
    summaryLabelPurple: {
        color: "#16A34A",
    },
    summaryLabelGreen: {
        color: "#DC2626",
    },

    summaryCardValue: {
        fontSize: 24,        // ✅ même taille value
        fontWeight: "700",
        color: "#111827",
    },


    // ----- Filters / search bar -----
    filtersRow: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
    },

    searchWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
        borderWidth: 0,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    searchIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
        resizeMode: "contain",
        tintColor: "#9CA3AF",
    },

    searchInput: {
        flex: 1,
        fontSize: 13,
        color: "#111827",
        ...Platform.select({
            web: {
                outlineWidth: 0,
                outlineColor: "transparent",
            },
        }),
    },

    filterButton: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 18,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        minWidth: 90,
    },

    filterButtonText: {
        fontSize: 12,
        color: "#374151",
    },

    resetButton: {
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: "#E5E0FF",
        justifyContent: "center",
        alignItems: "center",
    },

    resetButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#5B3CFF",
    },

    // ----- Table -----
    tableHeaderRow: {
        marginTop: 20,
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.06)",
    },

    headerCell: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6B7280",
    },

    headerCellUser: {
        flex: 2,
    },
    headerCellType: {
        flex: 1.1,
    },
    headerCellTarget: {
        flex: 2,
    },
    headerCellReason: {
        flex: 2,
    },
    headerCellDate: {
        flex: 1.1,
    },
    headerCellStatus: {
        flex: 1.2,
    },
    headerCellActions: {
        flex: 1,
        textAlign: "right",
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.04)",
    },

    cellText: {
        fontSize: 13,
        color: "#111827",
    },

    cellUser: {
        flex: 2,
    },
    cellType: {
        flex: 1.1,
    },
    cellTarget: {
        flex: 2,
    },
    cellReason: {
        flex: 2,
    },
    cellDate: {
        flex: 1.1,
    },
    cellStatus: {
        flex: 1.2,
    },
    cellActions: {
        flex: 1,
        alignItems: "flex-end",
    },

    statusBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    statusBadgeText: {
        fontSize: 11,
        fontWeight: "600",
        color: Colors.white,
    },

    statusBadgePending: {
        backgroundColor: "#FF8A4A",
    },
    statusBadgeAccepted: {
        backgroundColor: "#22C55E",
    },
    statusBadgeRejected: {
        backgroundColor: "#F03E3E",
    },

    actionButton: {
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#B168FF",
    },

    actionButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.white,
    },

    // ----- Modal (popup) -----
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },

    modalContainer: {
        width: 460,
        maxWidth: "100%",
        borderRadius: 16,
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 18,
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
        width: 28,
        height: 28,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },

    modalCloseButtonText: {
        fontSize: 18,
        lineHeight: 18,
        color: "#6B7280",
    },

    modalContent: {
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
        paddingTop: 12,
        paddingBottom: 4,
    },

    modalLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },

    modalLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
    },

    modalValue: {
        fontSize: 12,
        color: "#111827",
    },

    modalMotifBlock: {
        marginTop: 10,
    },

    modalMotifTitle: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#111827",
    },

    modalMotifDescription: {
        marginTop: 4,
        fontSize: 12,
        color: "#4B5563",
        lineHeight: 16,
    },

    modalButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        columnGap: 16,
        marginTop: 20,
    },
    modalRejectButton: {
        flex: 1,
        backgroundColor: "#FF5A36",
        borderRadius: 24,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    modalRejectButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 13,},

    modalPrimaryButton: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#22C55E",
    },

    modalPrimaryButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.white,
        textTransform: "capitalize",
    },

    modalSecondaryButton: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF8A4A",
    },

    modalSecondaryButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.white,
    },
});

export default reportStyles;