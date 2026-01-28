import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

import AdminLineChart from "@/components/AdminLineChart";
import styles from "@/styles/pages/DashboardAdminStyles";
import { adminService } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

type DashboardStats = {
    associationsCount: number;
    completedMissionsCount: number;
    usersCount: number;
    volunteersPerMonth: { month: string; value: number }[];
    missionsPerMonth: { month: string; value: number }[];
    pendingReportsCount: number;
    pendingAssociationsCount: number;
};

export default function DashboardAdmin() {
    const { width } = useWindowDimensions();
    const isMobile = width < 900;
    const router = useRouter();
    const { t } = useLanguage();

    const { userType, isLoading: authLoading } = useAuth();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                // ✅ on attend que l'auth soit prête
                if (authLoading) return;

                // ✅ si pas admin, on évite l'appel
                if (userType !== "admin") {
                    setError(t('accessDeniedAdmin'));
                    setLoading(false);
                    return;
                }

                const data = await adminService.getDashboardStats(7);
                console.log("🟡 dashboard stats =", JSON.stringify(data, null, 2));

                if (isMounted) setStats(data);
            } catch (e) {
                console.error("Dashboard load error:", e);
                if (isMounted) {
                    setError(t('loadStatsError'));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [authLoading, userType, t]);

    // ⚠️ Ajuste tes routes selon ta structure Expo Router (groupes, etc.)
    const handleNavigateToReports = () => router.push("/(admin)/report");
    const handleNavigateToAssociations = () =>
        router.push("/(admin)/search");

    if (loading || !stats) {
        return (
            <View style={styles.page}>
                <View
                    style={[
                        styles.mainBackground,
                        { justifyContent: "center", alignItems: "center" },
                    ]}
                >
                    {error ? (
                        <Text style={{ color: "red" }}>{error}</Text>
                    ) : (
                        <Text>{t('loadingDashboard')}</Text>
                    )}
                </View>
            </View>
        );
    }

    const volunteerMonths = stats.volunteersPerMonth.map((p) => p.month);
    const volunteerValues = stats.volunteersPerMonth.map((p) => p.value);

    const missionMonths = stats.missionsPerMonth.map((p) => p.month);
    const missionValues = stats.missionsPerMonth.map((p) => p.value);

    return (
        <View style={styles.page}>
            <View style={styles.mainBackground}>
                <ScrollView
                    style={styles.mainScroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator
                    scrollEventThrottle={16}
                >
                    <View style={styles.contentWrapper}>
                        <Text style={styles.title}>{t('dashboardTitle')}</Text>
                        <Text style={styles.subtitle}>
                            {t('dashboardSubtitle')}
                        </Text>

                        <View style={[styles.kpiRow, isMobile && styles.column]}>
                            <KpiCard
                                icon={require("@/assets/images/hearticondahboard.png")}
                                label={t('assosCount')}
                                value={Number(stats.associationsCount ?? 0).toLocaleString(
                                    "fr-FR"
                                )}
                            />
                            <KpiCard
                                icon={require("@/assets/images/CheckIconDashboard.png")}
                                label={t('completedMissions')}
                                value={Number(stats.completedMissionsCount ?? 0).toLocaleString(
                                    "fr-FR"
                                )}
                            />
                            <KpiCard
                                icon={require("@/assets/images/PersoniconDashboard.png")}
                                label={t('usersCount')}
                                value={Number(stats.usersCount ?? 0).toLocaleString("fr-FR")}
                            />
                        </View>

                        <View style={[styles.chartsRow, isMobile && styles.column]}>
                            <View style={styles.block}>
                                <Text style={styles.blockTitle}>{t('newVolunteersMonth')}</Text>
                                <View style={[styles.chartCard, styles.chartOrange]}>
                                    <AdminLineChart
                                        labels={volunteerMonths}
                                        values={volunteerValues}
                                        lineColor="#FF7630"
                                    />
                                </View>
                            </View>

                            <View style={styles.block}>
                                <Text style={styles.blockTitle}>{t('completedMissionsMonth')}</Text>
                                <View style={[styles.chartCard, styles.chartPurple]}>
                                    <AdminLineChart
                                        labels={missionMonths}
                                        values={missionValues}
                                        lineColor="#3B5BFF"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.bottomRow, isMobile && styles.column]}>
                            <View style={styles.block}>
                                <Text style={styles.blockTitle}>{t('pendingReports')}</Text>
                                <PendingCard
                                    value={String(stats.pendingReportsCount ?? 0)}
                                    cardStyle={styles.pendingOrange}
                                    buttonStyle={styles.btnOrange}
                                    onPress={handleNavigateToReports}
                                />
                            </View>

                            <View style={styles.block}>
                                <Text style={styles.blockTitle}>
                                    {t('pendingAssos')}
                                </Text>
                                <PendingCard
                                    value={String(stats.pendingAssociationsCount ?? 0)}
                                    cardStyle={styles.pendingPurple}
                                    buttonStyle={styles.btnPurple}
                                    onPress={handleNavigateToAssociations}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

function KpiCard({
                     icon,
                     label,
                     value,
                 }: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
                <Image source={icon} style={styles.kpiIcon} />
            </View>
            <View style={styles.kpiTextWrap}>
                <Text style={styles.kpiLabel}>{label}</Text>
                <Text style={styles.kpiValue}>{value}</Text>
            </View>
        </View>
    );
}

function PendingCard({
                         value,
                         cardStyle,
                         buttonStyle,
                         onPress,
                     }: {
    value: string;
    cardStyle: any;
    buttonStyle: any;
    onPress: () => void;
}) {
    const { t } = useLanguage();
    return (
        <View style={[styles.pendingCard, cardStyle]}>
            <Text style={styles.pendingValue}>{value}</Text>
            <TouchableOpacity style={[styles.pendingBtn, buttonStyle]} onPress={onPress}>
                <Text style={styles.pendingBtnText}>{t('process')}</Text>
            </TouchableOpacity>
        </View>
    );
}
