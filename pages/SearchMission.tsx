import React, { useState, useCallback, useMemo, useRef } from "react";
import {
    View,
    FlatList,
    Platform,
    useWindowDimensions,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Modal,
    TextInput,
} from "react-native";
import { Href, useRouter, useFocusEffect } from "expo-router";

import { haversineKm, formatDistance } from "@/utils/geo";
import { geocodeAddressNominatim } from "@/utils/geocode";

import { styles } from "@/styles/pages/SearchMissionStyles";
import { Colors } from "@/constants/colors";
import { SearchFilters } from "@/types/search.types";

import MobileSearchBar from "@/components/MobileSearchBar";
import SearchBar from "@/components/SearchBar";
import MissionVolunteerCardHorizontal from "@/components/MissionVolunteerCardHorizontal";
import NearbyMissionCard from "@/components/NearbyMissionCard";
import AlertToast from "@/components/AlertToast";

import { missionService } from "@/services/missionService";
import { volunteerService } from "@/services/volunteerService";
import { categoryService } from "@/services/category.service";

import { useAuth } from "@/context/AuthContext";
import { Mission } from "@/models/mission.model";
import { Category } from "@/models/category.model";

type NearSortMode = "distance" | "relevance";
type AllSortMode = "recent" | "volunteers";

export default function ResearchMission() {
    const router = useRouter();
    const { userType } = useAuth();
    const isWeb = Platform.OS === "web";
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 900;

    // DATA
    const [allMissions, setAllMissions] = useState<Mission[]>([]);
    const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ visible: false, title: "", message: "" });

    // TRI
    const [nearSort, setNearSort] = useState<NearSortMode>("distance");
    const [allSort, setAllSort] = useState<AllSortMode>("recent");

    // Adresse (bénévole si dispo, sinon saisie)
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [currentLocationLabel, setCurrentLocationLabel] = useState("Veuillez entrer une adresse");

    // coords & distances
    const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [distanceByMissionId, setDistanceByMissionId] = useState<Map<number, number>>(new Map());

    // Popup
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [editAddress, setEditAddress] = useState("");
    const [editZip, setEditZip] = useState("");

    // Pagination “1/100” : affecte seulement "toutes les missions"
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(1);

    // Nearby carousel (flèches)
    const nearListRef = useRef<FlatList<Mission> | null>(null);
    const [nearIndex, setNearIndex] = useState(0);

    const showToast = useCallback((title: string, message: string) => {
        setToast({ visible: true, title, message });
    }, []);

    const checkAuthAndRedirect = useCallback(() => {
        if (!userType || userType === "volunteer_guest") {
            showToast("Connexion requise", "Vous devez être connecté pour effectuer cette action.");
            return false;
        }
        return true;
    }, [userType, showToast]);

    const buildQuery = useCallback((addr: string, z: string) => {
        const a = (addr || "").trim();
        const zp = (z || "").trim();
        return [a, zp, "France"].filter(Boolean).join(", ");
    }, []);

    const clearGeo = useCallback((label?: string) => {
        setUserCoords(null);
        setDistanceByMissionId(new Map());
        setCurrentLocationLabel(label ?? "Veuillez entrer une adresse");
    }, []);

    const recomputeDistancesFromAddress = useCallback(
        async (addr: string, z: string, missions: Mission[]) => {
            const query = buildQuery(addr, z);

            if (!query) {
                clearGeo("Veuillez entrer une adresse");
                return;
            }

            setCurrentLocationLabel(query);

            const coords = await geocodeAddressNominatim(query);
            setUserCoords(coords);

            if (!coords) {
                setDistanceByMissionId(new Map());
                return;
            }

            const map = new Map<number, number>();
            for (const mission of missions) {
                const mLat = mission.location?.lat;
                const mLon = mission.location?.longitude;
                if (typeof mLat === "number" && typeof mLon === "number") {
                    map.set(mission.id_mission, haversineKm(coords.lat, coords.lon, mLat, mLon));
                }
            }
            setDistanceByMissionId(map);
        },
        [buildQuery, clearGeo]
    );

    const resetPagination = useCallback(() => {
        setPage(1);
    }, []);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            const loadData = async () => {
                if (allMissions.length === 0) setLoading(true);

                try {
                    const [missionsData, categoriesData, favoritesData] = await Promise.all([
                        missionService.getAll(),
                        categoryService.getAll(),
                        userType === "volunteer" ? volunteerService.getFavorites() : Promise.resolve([]),
                    ]);

                    if (cancelled) return;

                    const missions = missionsData || [];
                    setAllMissions(missions);
                    setFilteredMissions(missions);
                    setCategories(categoriesData || []);
                    resetPagination();

                    const ids = (favoritesData || []).map((m: any) => m.id_mission);
                    setFavoriteIds(ids);

                    // Récuperation adresse profil si c un benevole
                    if (userType === "volunteer") {
                        try {
                            const me = await volunteerService.getMe();
                            const meAddr = (me?.address || "").trim();
                            const meZip = (me?.zip_code || "").trim();

                            setAddress(meAddr);
                            setZip(meZip);

                            if (!meAddr && !meZip) {
                                clearGeo("Veuillez entrer une adresse");
                            } else {
                                await recomputeDistancesFromAddress(meAddr, meZip, missions);
                            }
                        } catch {
                            setAddress("");
                            setZip("");
                            clearGeo("Veuillez entrer une adresse");
                        }
                    } else {
                        // guest
                        setAddress("");
                        setZip("");
                        clearGeo("Veuillez entrer une adresse");
                    }
                } catch (e) {
                    if (!cancelled) {
                        setToast({ visible: true, title: "Erreur", message: "Impossible de charger les missions." });
                    }
                } finally {
                    if (!cancelled) setLoading(false);
                }
            };

            loadData();
            return () => {
                cancelled = true;
            };
        }, [userType, recomputeDistancesFromAddress, clearGeo, resetPagination])
    );

    const handleToggleFavorite = useCallback(
        async (missionId: number) => {
            if (!checkAuthAndRedirect()) return;

            const isFav = favoriteIds.includes(missionId);
            setFavoriteIds((prev) => (isFav ? prev.filter((id) => id !== missionId) : [...prev, missionId]));

            try {
                if (isFav) await volunteerService.removeFavorite(missionId);
                else await volunteerService.addFavorite(missionId);
            } catch {
                setFavoriteIds((prev) => (isFav ? [...prev, missionId] : prev.filter((id) => id !== missionId)));
                showToast("Erreur", "Impossible de mettre à jour les favoris.");
            }
        },
        [checkAuthAndRedirect, favoriteIds, showToast]
    );

    const handlePressMission = useCallback(
        (missionId: number) => {
            const rootPath = userType === "volunteer" ? "/(volunteer)" : "/(guest)";
            router.push(`${rootPath}/search/mission/${missionId}` as Href);
        },
        [userType, router]
    );

    // Filtrage
    const performFilter = (text: string, filters: Partial<SearchFilters>) => {
        const lowerText = text.toLowerCase();

        const filtered = allMissions.filter((mission) => {
            const matchText =
                (mission.name || "").toLowerCase().includes(lowerText) ||
                (mission.description || "").toLowerCase().includes(lowerText);

            let matchCategory = true;
            if (filters.category && filters.category !== "-") {
                matchCategory = mission.category?.label === filters.category;
            }

            let matchZip = true;
            if (filters.zipCode) {
                matchZip = mission.location?.zip_code === filters.zipCode;
            }

            let matchDate = true;
            if (filters.date) {
                const filterDate = new Date(filters.date);
                filterDate.setHours(0, 0, 0, 0);
                const missionStart = new Date(mission.date_start);
                missionStart.setHours(0, 0, 0, 0);
                matchDate = missionStart >= filterDate;
            }

            return matchText && matchCategory && matchZip && matchDate;
        });

        setFilteredMissions(filtered);
        resetPagination();
    };

    const handleWebSearch = (text: string, filters: SearchFilters) => performFilter(text, filters);
    const handleMobileSearch = (text: string, filters: SearchFilters) => performFilter(text, filters);

    const distanceLabelFor = useCallback(
        (missionId: number) => {
            const km = distanceByMissionId.get(missionId);
            if (km == null) return undefined;
            return formatDistance(km);
        },
        [distanceByMissionId]
    );

    const hasLocation = useMemo(() => !!userCoords, [userCoords]);

    // mission proches sorted
    const nearMissions = useMemo(() => {
        if (!hasLocation) return [];

        const base = [...filteredMissions];

        if (nearSort === "distance") {
            base.sort((a, b) => {
                const da = distanceByMissionId.get(a.id_mission);
                const db = distanceByMissionId.get(b.id_mission);
                if (da == null && db == null) return 0;
                if (da == null) return 1;
                if (db == null) return -1;
                return da - db;
            });
        }

        return base;
    }, [filteredMissions, hasLocation, nearSort, distanceByMissionId]);

    // All missions sorted (uniquement: récentes ou bénévoles)
    const allMissionsSorted = useMemo(() => {
        const base = [...filteredMissions];

        if (allSort === "recent") {
            base.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
            return base;
        }

        // volunteers
        base.sort((a, b) => {
            const va = (a as any).volunteers_enrolled ?? 0; // adapte si ton champ s'appelle autrement
            const vb = (b as any).volunteers_enrolled ?? 0;
            return vb - va;
        });
        return base;
    }, [filteredMissions, allSort]);


    const totalPages = useMemo(() => Math.max(1, Math.ceil(allMissionsSorted.length / PAGE_SIZE)), [allMissionsSorted.length]);
    const safePage = Math.min(page, totalPages);

    const allMissionsPaged = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return allMissionsSorted.slice(start, end);
    }, [allMissionsSorted, safePage]);

    const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const goNext = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);


    const scrollNearTo = useCallback((index: number) => {
        if (!nearListRef.current) return;
        nearListRef.current.scrollToIndex({ index, animated: true });
    }, []);

    const nearPrev = useCallback(() => {
        const next = Math.max(0, nearIndex - 1);
        setNearIndex(next);
        scrollNearTo(next);
    }, [nearIndex, scrollNearTo]);

    const nearNext = useCallback(() => {
        const next = Math.min(Math.max(0, nearMissions.length - 1), nearIndex + 1);
        setNearIndex(next);
        scrollNearTo(next);
    }, [nearIndex, nearMissions.length, scrollNearTo]);

    // Popup
    const openLocationModal = useCallback(() => {
        setEditAddress(address);
        setEditZip(zip);
        setLocationModalVisible(true);
    }, [address, zip]);

    const saveLocation = useCallback(async () => {
        const addr = editAddress.trim();
        const z = editZip.trim();

        if (!addr && !z) {
            showToast("Adresse requise", "Veuillez saisir une adresse et/ou un code postal.");
            return;
        }

        setLocationModalVisible(false);
        setAddress(addr);
        setZip(z);

        await recomputeDistancesFromAddress(addr, z, allMissions);
    }, [editAddress, editZip, recomputeDistancesFromAddress, allMissions, showToast]);

    const canSave = useMemo(() => editAddress.trim().length > 0 || editZip.trim().length > 0, [editAddress, editZip]);

    return (
        <View style={[styles.container, { backgroundColor: Colors.white }]}>
            <AlertToast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                onClose={() => setToast({ ...toast, visible: false })}
            />

            {/* Titre */}
            <View style={{ width: "100%" }}>
                <Text style={[styles.pageTitle, { paddingLeft: isWeb ? (isSmallScreen ? 60 : 0) : 0 }]}>
                    Recherche Mission
                </Text>
                <Text style={styles.pageSubtitle}>Recherche des missions</Text>
            </View>

            {/* Filters row */}
            <View style={[styles.searchRow, { zIndex: 9999 }]}>
                {isWeb ? (
                    <SearchBar categories={categories.map((c) => c.label)} onSearch={handleWebSearch} />
                ) : (
                    <MobileSearchBar category_list={categories.map((c) => c.label)} onSearch={handleMobileSearch} />
                )}
            </View>

            {/* Locations  */}
            <View style={styles.locationBanner}>
                <Text style={styles.locationDot}>●</Text>

                {hasLocation ? (
                    <Text style={styles.locationText}>
                        vous etes a <Text style={{ fontWeight: "800" }}>{currentLocationLabel}</Text>
                    </Text>
                ) : (
                    <Text style={styles.locationText}>
                        <Text style={{ fontWeight: "800" }}>Veuillez entrer une adresse</Text>
                    </Text>
                )}

                <TouchableOpacity onPress={openLocationModal} activeOpacity={0.8}>
                    <Text style={styles.locationChange}>(changer)</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                {loading ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color={Colors.orange} />
                    </View>
                ) : (
                    <FlatList
                        data={allMissionsPaged}
                        keyExtractor={(item) => item.id_mission.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={
                            <>
                                {/*  MISSIONS PROCHES  */}
                                <View style={styles.sectionHeaderRow}>
                                    <View style={styles.sectionTitleRow}>
                                        <Text style={styles.sectionIcon}>📍</Text>
                                        <Text style={styles.sectionTitle}>Mission proche de chez vous</Text>
                                    </View>

                                    <View style={styles.sortRow}>
                                        <Text style={styles.sortLabel}>Trier par :</Text>
                                        <TouchableOpacity
                                            onPress={() => setNearSort((p) => (p === "distance" ? "relevance" : "distance"))}
                                            style={styles.sortButton}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={styles.sortButtonText}>
                                                {nearSort === "distance" ? "Distance" : "Pertinence"}
                                            </Text>
                                            <Text style={styles.sortChevron}>▼</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {!hasLocation ? (
                                    <Text style={{ color: "#888", paddingVertical: 10 }}>
                                        Entrez une adresse pour voir les missions les plus proches.
                                    </Text>
                                ) : nearMissions.length === 0 ? (
                                    <Text style={{ color: "#888", paddingVertical: 10 }}>
                                        Aucune mission proche trouvée.
                                    </Text>
                                ) : (
                                    <View style={{ position: "relative" }}>
                                        {/* Flèches */}
                                        <View
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: "40%",
                                                zIndex: 5,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={nearPrev}
                                                disabled={nearIndex === 0}
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.92)",
                                                    borderWidth: 1,
                                                    borderColor: "#E7E7E7",
                                                    borderRadius: 999,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    opacity: nearIndex === 0 ? 0.4 : 1,
                                                }}
                                                activeOpacity={0.85}
                                            >
                                                <Text style={{ fontWeight: "900" }}>‹</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                top: "40%",
                                                zIndex: 5,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={nearNext}
                                                disabled={nearIndex >= nearMissions.length - 1}
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.92)",
                                                    borderWidth: 1,
                                                    borderColor: "#E7E7E7",
                                                    borderRadius: 999,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    opacity: nearIndex >= nearMissions.length - 1 ? 0.4 : 1,
                                                }}
                                                activeOpacity={0.85}
                                            >
                                                <Text style={{ fontWeight: "900" }}>›</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <FlatList
                                            ref={nearListRef}
                                            data={nearMissions}
                                            keyExtractor={(m) => `near-${m.id_mission}`}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 28 }}
                                            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                                            renderItem={({ item: m }) => (
                                                <NearbyMissionCard
                                                    mission={m}
                                                    distanceLabel={distanceLabelFor(m.id_mission)}
                                                    isFavorite={favoriteIds.includes(m.id_mission)}
                                                    onPressMission={() => handlePressMission(m.id_mission)}
                                                    onPressFavorite={
                                                        userType === "volunteer"
                                                            ? () => handleToggleFavorite(m.id_mission)
                                                            : () => checkAuthAndRedirect()
                                                    }
                                                />
                                            )}
                                        />
                                    </View>
                                )}

                                {/* TOUTES LES MISSIONS  */}
                                <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
                                    <View style={styles.sectionTitleRow}>
                                        <Text style={styles.sectionIcon}>📍</Text>
                                        <Text style={styles.sectionTitle}>Toutes les missions</Text>
                                    </View>

                                    <View style={styles.sortRow}>
                                        <Text style={styles.sortLabel}>Trier par :</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setAllSort((p) => (p === "recent" ? "volunteers" : "recent"));
                                                resetPagination();
                                            }}
                                            style={styles.sortButton}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={styles.sortButtonText}>
                                                {allSort === "recent" ? "Récentes" : "Bénévoles"}
                                            </Text>
                                            <Text style={styles.sortChevron}>▼</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 12 }}>
                                <MissionVolunteerCardHorizontal
                                    mission={item}
                                    isFavorite={favoriteIds.includes(item.id_mission)}
                                    onPressMission={() => handlePressMission(item.id_mission)}
                                    onPressFavorite={
                                        userType === "volunteer"
                                            ? () => handleToggleFavorite(item.id_mission)
                                            : () => checkAuthAndRedirect()
                                    }
                                />
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={{ textAlign: "center", marginTop: 40, color: "gray" }}>
                                Aucune mission trouvée.
                            </Text>
                        }
                        ListFooterComponent={
                            <View style={styles.pagination}>
                                <TouchableOpacity onPress={goPrev} disabled={safePage === 1} activeOpacity={0.85}>
                                    <Text style={[styles.paginationArrow, { opacity: safePage === 1 ? 0.35 : 1 }]}>{"<"}</Text>
                                </TouchableOpacity>

                                <Text style={styles.paginationText}>
                                    Page {safePage}/{totalPages}
                                </Text>

                                <TouchableOpacity onPress={goNext} disabled={safePage === totalPages} activeOpacity={0.85}>
                                    <Text style={[styles.paginationArrow, { opacity: safePage === totalPages ? 0.35 : 1 }]}>{">"}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </KeyboardAvoidingView>

            {/* MODAL INLINE */}
            <Modal
                visible={locationModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            maxWidth: 520,
                            backgroundColor: Colors.white,
                            borderRadius: 14,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            shadowRadius: 12,
                            elevation: 6,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 6 }}>
                            Modifier la localisation
                        </Text>
                        <Text style={{ color: "#666", marginBottom: 14 }}>
                            Entrez une adresse et/ou un code postal. On géocode et on met à jour les missions proches.
                        </Text>

                        <Text style={{ fontWeight: "700", marginBottom: 6 }}>Adresse</Text>
                        <TextInput
                            value={editAddress}
                            onChangeText={setEditAddress}
                            placeholder="Ex: 42 ter rue Henri Barbusse"
                            style={{
                                borderWidth: 1,
                                borderColor: "#E7E7E7",
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: Platform.OS === "web" ? 10 : 8,
                                marginBottom: 12,
                            }}
                        />

                        <Text style={{ fontWeight: "700", marginBottom: 6 }}>Code postal</Text>
                        <TextInput
                            value={editZip}
                            onChangeText={setEditZip}
                            placeholder="Ex: 94450"
                            keyboardType="number-pad"
                            style={{
                                borderWidth: 1,
                                borderColor: "#E7E7E7",
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: Platform.OS === "web" ? 10 : 8,
                                marginBottom: 16,
                            }}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => setLocationModalVisible(false)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: "#E7E7E7",
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={{ fontWeight: "700" }}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={saveLocation}
                                disabled={!canSave}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: canSave ? Colors.orange : "#F2F2F2",
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={{ fontWeight: "800", color: canSave ? Colors.white : "#999" }}>
                                    Enregistrer
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ======================================================== */}
        </View>
    );
}
