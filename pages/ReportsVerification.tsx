import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";

import reportStyles from "@/styles/pages/ReportsVerificationStyles";

import { adminService } from "@/services/adminService";
import type {
    ReportPublic,
    ReportProcessingState,
    ReportStatsResponse,
} from "@/models/admin.model";
import { useLanguage } from "@/context/LanguageContext";


/* =========================
   MAPPERS API -> UI
========================= */

const mapApiStateToUi = (s: ReportProcessingState): ReportState => {
    if (s === "PENDING") return "pending";
    if (s === "APPROVED") return "accepted";
    return "rejected";
};

const mapUiStateToApi = (s: ReportState): ReportProcessingState => {
    if (s === "pending") return "PENDING";
    if (s === "accepted") return "APPROVED";
    return "REJECTED";
};

// Backend renvoie target: PROFILE/MISSION/ASSOCIATION
// Ta UI veut Mission/Utilisateur/Association
const mapApiTargetToUiType = (target: string): ReportType => {
    if (target === "MISSION") return "Mission";
    if (target === "ASSOCIATION") return "Association";
    return "Volunteer";
};

// ISO -> dd/mm/yyyy (simple)
const formatDateFr = (iso: string): string => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

const mapApiReportToUi = (r: ReportPublic): Report => ({
    id: r.id_report,
    type: mapApiTargetToUiType(r.target),
    target: r.target,
    reason: r.reason,
    dateReporting: formatDateFr(r.date_reporting),
    state: mapApiStateToUi(r.state),
    reporterName: r.reporter_name,
    reportedName: r.reported_name,
});

const mapStatsToUiCounts = (stats: ReportStatsResponse | null) => {
    if (!stats) return { pending: 0, accepted: 0, rejected: 0 };

    const pending = (stats as any).PENDING ?? (stats as any).pending ?? 0;
    const accepted = (stats as any).APPROVED ?? (stats as any).accepted ?? 0;
    const rejected = (stats as any).REJECTED ?? (stats as any).rejected ?? 0;

    return { pending, accepted, rejected };
};

type ReportState = "pending" | "accepted" | "rejected";
type ReportType = "Mission" | "Volunteer" | "Association";

type Report = {
    id: number;
    type: ReportType;
    target: string;
    reason: string;
    dateReporting: string;
    state: ReportState;
    reporterName: string;
    reportedName: string;
};

export default function ReportsVerification() {
    const { t, language } = useLanguage();
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<ReportType | null>(null);
    const [selectedState, setSelectedState] = useState<ReportState | null>(null);

    const [stats, setStats] = useState<ReportStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [offset, setOffset] = useState(0);
    const limit = 100;
useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setErrorMsg(null);

                const [apiReports, apiStats] = await Promise.all([
                    adminService.getReports({ offset, limit }),
                    adminService.getReportStats(),
                ]);

                if (!mounted) return;

                setReports(apiReports.map(mapApiReportToUi));
                setStats(apiStats);
            } catch (e: any) {
                if (!mounted) return;
                setErrorMsg(e?.message ?? "Erreur lors du chargement des signalements.");
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, [offset]);

    const counts = useMemo(() => {
        const fromStats = mapStatsToUiCounts(stats);
        if (stats) return fromStats;

        let pending = 0,
            accepted = 0,
            rejected = 0;
        reports.forEach((r) => {
            if (r.state === "pending") pending++;
            else if (r.state === "accepted") accepted++;
            else rejected++;
        });
        return { pending, accepted, rejected };
    }, [reports, stats]);

    const filteredReports = useMemo(
        () =>
            reports.filter((r) => {
                const matchesSearch =
                    search.trim().length === 0 ||
                    [r.reporterName, r.reportedName, r.type, r.target, r.reason, r.dateReporting]
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLowerCase());

                const matchesType = selectedType === null || r.type === selectedType;
                const matchesState = selectedState === null || r.state === selectedState;

                return matchesSearch && matchesType && matchesState;
            }),
        [reports, search, selectedType, selectedState]
    );

    const handleStateFilterPress = () => {
        const order: (ReportState | null)[] = [null, "pending", "accepted", "rejected"];
        const currentIndex = order.indexOf(selectedState);
        setSelectedState(order[(currentIndex + 1) % order.length]);
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedType(null);
        setSelectedState(null);
    };

    const handleOpenDetails = (report: Report) => setSelectedReport(report);
    const handleCloseDetails = () => setSelectedReport(null);

    const refreshStats = async () => {
        try {
            const s = await adminService.getReportStats();
            setStats(s);
        } catch {
            // non bloquant
        }
    };

    const handleUpdateSelectedState = async (newUiState: ReportState) => {
        if (!selectedReport) return;

        const reportId = selectedReport.id;
        const apiState = mapUiStateToApi(newUiState);

        try {
            const updatedApi = await adminService.updateReportState(reportId, apiState);
            const updatedUi = mapApiReportToUi(updatedApi);

            setReports((prev) => prev.map((r) => (r.id === reportId ? updatedUi : r)));
            setSelectedReport(updatedUi);

            refreshStats();
        } catch (e: any) {
            console.error(e?.message ?? e);
        }
    };

    const handleMarkAsAccepted = () => handleUpdateSelectedState("accepted");
    const handleMarkAsRejected = () => handleUpdateSelectedState("rejected");
    
    // Mappers localized
    const mapApiTargetToUiType = (target: string): ReportType => {
        if (target === "MISSION") return "Mission";
        if (target === "ASSOCIATION") return "Association";
        return "Volunteer";
    };

    const formatDateLocal = (iso: string): string => {
        const d = new Date(iso);
        return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
    };

    // ... (rest of mappers)

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setErrorMsg(null);

                const [apiReports, apiStats] = await Promise.all([
                    adminService.getReports({ offset, limit }),
                    adminService.getReportStats(),
                ]);

                if (!mounted) return;

                setReports(apiReports.map(r => ({
                    id: r.id_report,
                    type: mapApiTargetToUiType(r.target),
                    target: r.target,
                    reason: r.reason,
                    dateReporting: formatDateLocal(r.date_reporting),
                    state: mapApiStateToUi(r.state),
                    reporterName: r.reporter_name,
                    reportedName: r.reported_name,
                })));
                setStats(apiStats);
            } catch (e: any) {
                if (!mounted) return;
                setErrorMsg(e?.message ?? t('loadReportsError'));
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, [offset, t, language]);

    // ...
    const getTypeFilterLabel = () => {
        if (!selectedType) return t('type');
        if (selectedType === "Mission") return t('mission');
        if (selectedType === "Association") return t('association');
        return t('volunteer');
    };

    const getStateFilterLabel = () => {
        if (!selectedState) return t('status');
        if (selectedState === "pending") return t('pending');
        if (selectedState === "accepted") return t('accepted');
        return t('rejected');
    };

    const handleTypeFilterPress = () => {
        const order: (ReportType | null)[] = [null, "Mission", "Volunteer", "Association"];
        const currentIndex = order.indexOf(selectedType);
        setSelectedType(order[(currentIndex + 1) % order.length]);
    };

    // ...
    const getStatusLabel = (state: ReportState) => {
        if (state === "pending") return t('pending').toLowerCase();
        if (state === "accepted") return t('accepted').toLowerCase();
        return t('rejected').toLowerCase();
    };

    // ...
    return (
        <View style={reportStyles.page}>
            <View style={reportStyles.mainBackground}>
                <ScrollView
                    style={reportStyles.mainScroll}
                    contentContainerStyle={reportStyles.scrollContent}
                    showsVerticalScrollIndicator
                >
                    <View style={reportStyles.contentWrapper}>
                        <Text style={reportStyles.title}>{t('reportsTitle')}</Text>
                        <Text style={reportStyles.subtitle}>{t('reportsSubtitle')}</Text>

                        {loading && <Text style={{ marginBottom: 10 }}>{t('loadingReports')}</Text>}
                        {errorMsg && <Text style={{ marginBottom: 10, color: "red" }}>{errorMsg}</Text>}

                        <View style={reportStyles.summaryRow}>
                            <View
                                style={[
                                    reportStyles.summaryCard,
                                    reportStyles.summaryCardOrange,
                                ]}
                            >
                                <Text style={[reportStyles.summaryCardLabel, reportStyles.summaryLabelOrange]}>
                                    {t('pending')}
                                </Text>
                                <Text style={reportStyles.summaryCardValue}>{counts.pending}</Text>
                            </View>

                            <View
                                style={[
                                    reportStyles.summaryCard,
                                    reportStyles.summaryCardPurple,
                                ]}
                            >
                                <Text style={[reportStyles.summaryCardLabel, reportStyles.summaryLabelPurple]}>
                                    {t('accepted')}
                                </Text>
                                <Text style={reportStyles.summaryCardValue}>{counts.accepted}</Text>
                            </View>

                            <View
                                style={[
                                    reportStyles.summaryCard,
                                    reportStyles.summaryCardGreen,
                                ]}
                            >
                                <Text style={[reportStyles.summaryCardLabel, reportStyles.summaryLabelGreen]}>
                                    {t('rejected')}
                                </Text>
                                <Text style={reportStyles.summaryCardValue}>{counts.rejected}</Text>
                            </View>
                        </View>

                        <View style={reportStyles.filtersRow}>
                            <View style={reportStyles.searchWrapper}>
                                <Image source={require("../assets/images/loupe.png")} style={reportStyles.searchIcon} />
                                <TextInput
                                    style={reportStyles.searchInput}
                                    placeholder={t('searchReportPlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    value={search}
                                    onChangeText={setSearch}
                                />
                            </View>

                            <TouchableOpacity style={reportStyles.filterButton} onPress={handleTypeFilterPress}>
                                <Text style={reportStyles.filterButtonText}>{getTypeFilterLabel()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={reportStyles.filterButton} onPress={handleStateFilterPress}>
                                <Text style={reportStyles.filterButtonText}>{getStateFilterLabel()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={reportStyles.resetButton} onPress={handleResetFilters}>
                                <Text style={reportStyles.resetButtonText}>{t('reset')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={reportStyles.tableHeaderRow}>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellUser]}>{t('user')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellType]}>{t('type')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellTarget]}>{t('target')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellReason]}>{t('reason')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellDate]}>{t('date')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellStatus]}>{t('status')}</Text>
                            <Text style={[reportStyles.headerCell, reportStyles.headerCellActions]}>{t('actions')}</Text>
                        </View>

                        {filteredReports.map((report) => (
                            <View key={report.id} style={reportStyles.tableRow}>
                                <Text style={[reportStyles.cellText, reportStyles.cellUser]}>{report.reporterName}</Text>
                                <Text style={[reportStyles.cellText, reportStyles.cellType]}>
                                    {report.type === "Mission" ? t('mission') : report.type === "Association" ? t('association') : t('volunteer')}
                                </Text>

                                <Text style={[reportStyles.cellText, reportStyles.cellTarget]} numberOfLines={1}>
                                    {report.target}
                                </Text>

                                <Text style={[reportStyles.cellText, reportStyles.cellReason]} numberOfLines={1}>
                                    {report.reason}
                                </Text>

                                <Text style={[reportStyles.cellText, reportStyles.cellDate]}>{report.dateReporting}</Text>

                                <View style={reportStyles.cellStatus}>
                                    <View
                                        style={[
                                            reportStyles.statusBadge,
                                            report.state === "pending" && reportStyles.statusBadgePending,
                                            report.state === "accepted" && reportStyles.statusBadgeAccepted,
                                            report.state === "rejected" && reportStyles.statusBadgeRejected,
                                        ]}
                                    >
                                        <Text style={reportStyles.statusBadgeText}>{getStatusLabel(report.state)}</Text>
                                    </View>
                                </View>

                                <View style={reportStyles.cellActions}>
                                    <TouchableOpacity
                                        style={reportStyles.actionButton}
                                        onPress={() => handleOpenDetails(report)}
                                    >
                                        <Text style={reportStyles.actionButtonText}>{t('view')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {selectedReport && (
                <View style={reportStyles.modalOverlay}>
                    <View style={reportStyles.modalContainer}>
                        <View style={reportStyles.modalHeaderRow}>
                            <Text style={reportStyles.modalTitle}>{t('reportDetails')}</Text>
                            <TouchableOpacity onPress={handleCloseDetails} style={reportStyles.modalCloseButton}>
                                <Text style={reportStyles.modalCloseButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={reportStyles.modalContent}>
                            <View style={reportStyles.modalLine}>
                                <Text style={reportStyles.modalLabel}>{t('user')}</Text>
                                <Text style={reportStyles.modalValue}>{selectedReport.reporterName}</Text>
                            </View>

                            <View style={reportStyles.modalLine}>
                                <Text style={reportStyles.modalLabel}>{t('type')}</Text>
                                <Text style={reportStyles.modalValue}>
                                    {selectedReport.type === "Mission" ? t('mission') : selectedReport.type === "Association" ? t('association') : t('volunteer')}
                                </Text>
                            </View>

                            <View style={reportStyles.modalLine}>
                                <Text style={reportStyles.modalLabel}>{t('target')}</Text>
                                <Text style={reportStyles.modalValue}>{selectedReport.target}</Text>
                            </View>

                            <View style={reportStyles.modalLine}>
                                <Text style={reportStyles.modalLabel}>{t('date')}</Text>
                                <Text style={reportStyles.modalValue}>{selectedReport.dateReporting}</Text>
                            </View>

                            <View style={reportStyles.modalLine}>
                                <Text style={reportStyles.modalLabel}>{t('status')}</Text>
                                <View
                                    style={[
                                        reportStyles.statusBadge,
                                        selectedReport.state === "pending" && reportStyles.statusBadgePending,
                                        selectedReport.state === "accepted" && reportStyles.statusBadgeAccepted,
                                        selectedReport.state === "rejected" && reportStyles.statusBadgeRejected,
                                    ]}
                                >
                                    <Text style={reportStyles.statusBadgeText}>{getStatusLabel(selectedReport.state)}</Text>
                                </View>
                            </View>

                            <View style={reportStyles.modalMotifBlock}>
                                <Text style={reportStyles.modalLabel}>{t('reason')}</Text>
                                <Text style={reportStyles.modalMotifTitle}>{selectedReport.reason}</Text>
                                <Text style={reportStyles.modalMotifDescription}>
                                    {t('reportConcerning')} {
                                        (selectedReport.type === "Mission" ? t('mission') : selectedReport.type === "Association" ? t('association') : t('volunteer')).toLowerCase()
                                    } "{selectedReport.target}" {t('forReason')} :{" "}
                                    {selectedReport.reason}.
                                </Text>
                            </View>
                        </View>

                        <View style={reportStyles.modalButtonsRow}>
                            <TouchableOpacity style={reportStyles.modalPrimaryButton} onPress={handleMarkAsAccepted}>
                                <Text style={reportStyles.modalPrimaryButtonText}>{t('markAsAccepted')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={reportStyles.modalRejectButton} onPress={handleMarkAsRejected}>
                                <Text style={reportStyles.modalRejectButtonText}>{t('markAsRejected')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
