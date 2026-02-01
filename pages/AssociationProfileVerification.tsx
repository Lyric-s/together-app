/**
 * DocumentsVerification
 *
 * Page d'administration permettant de :
 * - lister les documents envoyés par les associations (PENDING seulement),
 * - rechercher une association par nom, code RNA ou nom de document,
 * - ouvrir un popup de détails pour accepter ou rejeter le document,
 * - afficher un aperçu via presigned preview URL (admin endpoint).
 */

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Platform,
    Linking,
} from "react-native";

import styles from "@/styles/pages/AssociationProfileVerificationStyles";
import { adminService } from "@/services/adminService";
import { useLanguage } from "@/context/LanguageContext";
import { Text } from '@/components/ThemedText';

// --------------------
// Types UI (pour la page)
// --------------------
type StatutTraitement = "pending" | "accepted" | "rejected";

type AssociationDocument = {
    idDoc: number;
    docName: string;
    urlDoc: string | null; // (optionnel, pas utilisé pour l’aperçu)
    dateUpload: string; // déjà formaté pour affichage
    verifState: StatutTraitement;
    idAsso: number;
    assoName: string;
    rnaCode: string;
};

// --------------------
// Helpers
// --------------------
const formatDateLocalized = (iso: string, locale: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(locale === 'fr' ? "fr-FR" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function DocumentsVerification() {
    const { t, language, getFontSize, fontFamily } = useLanguage();
    const [documents, setDocuments] = useState<AssociationDocument[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<AssociationDocument | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

    const [search, setSearch] = useState("");
    const [selectedState, setSelectedState] = useState<StatutTraitement | null>("pending");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // ✅ Preview (presigned URL)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    // --------------------
    // Load data (PENDING docs + associations) and join
    // --------------------
    const fetchDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMsg(null);

            const [docsApi, assosApi] = await Promise.all([
                adminService.getPendingDocuments(), // ✅ endpoint pending
                adminService.getAllAssociationsInternal(),
            ]);

            const assoMap = new Map<number, { assoName: string; rnaCode: string }>(
                (assosApi || []).map((a: any) => [
                    a.id_asso,
                    { assoName: a.name, rnaCode: a.rna_code },
                ])
            );

            const joined: AssociationDocument[] = (docsApi || []).map((doc: any) => {
                const asso = assoMap.get(doc.id_asso);

                return {
                    idDoc: doc.id_doc,
                    docName: doc.doc_name,
                    urlDoc: doc.url_doc ?? null,
                    dateUpload: formatDateLocalized(doc.date_upload, language),

                    // ✅ pending only
                    verifState: "pending",

                    idAsso: doc.id_asso,
                    assoName: asso?.assoName ?? `Association #${doc.id_asso}`,
                    rnaCode: asso?.rnaCode ?? "—",
                };
            });

            setDocuments(joined);

            if (!selectedDoc && joined.length > 0) {
                setSelectedDoc(joined[0]);
            }
        } catch (e: any) {
            console.error("Erreur chargement documents:", e);
            setErrorMsg(t('docLoadError'));
        } finally {
            setIsLoading(false);
        }
    }, [selectedDoc, language, t]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // --------------------
    // Counts (pending only)
    // --------------------
    const counts = useMemo(() => {
        const pending = documents.length;
        const accepted = 0;
        const rejected = 0;
        return { pending, accepted, rejected };
    }, [documents]);

    // --------------------
    // Filtered docs (search + status)
    // --------------------
    const filteredDocuments = useMemo(
        () =>
            documents.filter((doc) => {
                const matchesSearch =
                    search.trim().length === 0 ||
                    [doc.assoName, doc.rnaCode, doc.docName]
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLowerCase());

                const matchesState = selectedState === null || doc.verifState === selectedState;

                return matchesSearch && matchesState;
            }),
        [documents, search, selectedState]
    );

    // --------------------
    // Labels
    // --------------------
    const getStatusLabel = (state: StatutTraitement) => {
        if (state === "pending") return t('pending').toLowerCase();
        if (state === "accepted") return t('accepted').toLowerCase();
        return t('rejected').toLowerCase();
    };

    const getStateFilterLabel = () => {
        if (!selectedState) return t('allCategories'); // fallback "Tous les statuts"
        if (selectedState === "pending") return t('pending');
        if (selectedState === "accepted") return t('accepted');
        return t('rejected');
    };

    // --------------------
    // UI handlers
    // --------------------
    const handleToggleStateFilter = () => {
        // pending only -> [null, pending]
        const order: (StatutTraitement | null)[] = [null, "pending"];
        const currentIndex = order.indexOf(selectedState);
        const nextIndex = (currentIndex + 1) % order.length;
        setSelectedState(order[nextIndex]);
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedState("pending");
    };

    // ✅ ouvre la modale + génère une presigned PREVIEW URL (admin)
    const handleSelectDoc = async (doc: AssociationDocument) => {
        setSelectedDoc(doc);
        setIsDetailOpen(true);

        setPreviewUrl(null);
        setPreviewError(null);

        try {
            setPreviewLoading(true);

            // ✅ IMPORTANT : utiliser l’endpoint PREVIEW (inline) côté ADMIN
            // Il doit exister dans ton adminService:
            // getAdminDocumentPreviewUrl(documentId) -> { preview_url, expires_in }
            const res = await adminService.getAdminDocumentPreviewUrl(doc.idDoc);

            const signed = res?.preview_url ?? null;

            if (!signed) {
                setPreviewError(t('noPreview'));
                return;
            }

            // ⚠️ on ne reconstruit pas l’URL : le backend renvoie déjà une URL complète MinIO
            setPreviewUrl(signed);
        } catch (e) {
            console.error("Erreur preview-url:", e);
            setPreviewError(t('noPreview'));
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsDetailOpen(false);
        setPreviewUrl(null);
        setPreviewError(null);
    };

    // --------------------
    // Approve/Reject (API + refetch)
    // --------------------
    const handleAccept = async () => {
        if (!selectedDoc) return;

        try {
            setIsLoading(true);
            await adminService.approveDocument(selectedDoc.idDoc);

            setIsDetailOpen(false);
            setPreviewUrl(null);
            setPreviewError(null);

            await fetchDocuments();
        } catch (e) {
            console.error("Erreur approve:", e);
            setErrorMsg(t('docApproveError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedDoc) return;

        try {
            setIsLoading(true);

            const reason = "Document invalide ou illisible";
            await adminService.rejectDocument(selectedDoc.idDoc, reason);

            setIsDetailOpen(false);
            setPreviewUrl(null);
            setPreviewError(null);

            await fetchDocuments();
        } catch (e) {
            console.error("Erreur reject:", e);
            setErrorMsg(t('docRejectError'));
        } finally {
            setIsLoading(false);
        }
    };

    // --------------------
    // Viewer component (WebView only on native)
    // --------------------
    const NativeWebView =
        Platform.OS === "web" ? null : require("react-native-webview").WebView;

    // --------------------
    // Render
    // --------------------
    return (
        <View style={styles.page}>
            <View style={styles.mainBackground}>
                <ScrollView
                    style={styles.mainScroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator
                >
                    <View style={styles.contentWrapper}>
                        <Text style={styles.title}>{t('docVerifTitle')}</Text>
                        <Text style={styles.subtitle}>
                            {t('docVerifSubtitle')}
                        </Text>

                        {isLoading && (
                            <View style={{ marginTop: 12 }}>
                                <ActivityIndicator />
                            </View>
                        )}

                        {errorMsg && <Text style={{ marginTop: 12, color: "red" }}>{errorMsg}</Text>}

                        <View style={styles.summaryRow}>
                            <View style={[styles.summaryCard, styles.summaryCardPending]}>
                                <Text style={[styles.summaryLabel, styles.summaryLabelPending]}>{t('pending')}</Text>
                                <Text style={styles.summaryValue}>{counts.pending}</Text>
                            </View>

                            <View style={[styles.summaryCard, styles.summaryCardAccepted]}>
                                <Text style={[styles.summaryLabel, styles.summaryLabelAccepted]}>{t('accepted')}</Text>
                                <Text style={styles.summaryValue}>{counts.accepted}</Text>
                            </View>

                            <View style={[styles.summaryCard, styles.summaryCardRejected]}>
                                <Text style={[styles.summaryLabel, styles.summaryLabelRejected]}>{t('rejected')}</Text>
                                <Text style={styles.summaryValue}>{counts.rejected}</Text>
                            </View>
                        </View>

                        <View style={styles.leftColumn}>
                            <View style={styles.filtersRow}>
                                <View style={styles.searchWrapper}>
                                    <TextInput
                                        style={[styles.searchInput, { fontSize: getFontSize(14), fontFamily }]}
                                        placeholder={t('searchDocPlaceholder')}
                                        placeholderTextColor="#9CA3AF"
                                        value={search}
                                        onChangeText={setSearch}
                                    />
                                </View>

                                <TouchableOpacity style={styles.filterButton} onPress={handleToggleStateFilter}>
                                    <Text style={styles.filterButtonText}>{getStateFilterLabel()}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                                    <Text style={styles.resetButtonText}>{t('reset')}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.headerCell, styles.headerCellAsso]}>{t('association')}</Text>
                                <Text style={[styles.headerCell, styles.headerCellRNA]}>{t('rnaCode')}</Text>
                                <Text style={[styles.headerCell, styles.headerCellDoc]}>{t('docDetails')}</Text>
                                <Text style={[styles.headerCell, styles.headerCellDate]}>{t('uploadDate')}</Text>
                                <Text style={[styles.headerCell, styles.headerCellStatus]}>{t('status')}</Text>
                                <Text style={[styles.headerCell, styles.headerCellActions]}>{t('actions')}</Text>
                            </View>

                            {filteredDocuments.map((doc) => (
                                <View key={doc.idDoc} style={styles.tableRow}>
                                    <Text style={[styles.cellText, styles.cellAsso]} numberOfLines={1}>
                                        {doc.assoName}
                                    </Text>

                                    <Text style={[styles.cellText, styles.cellRNA]}>{doc.rnaCode}</Text>

                                    <Text style={[styles.cellText, styles.cellDoc]} numberOfLines={1}>
                                        {doc.docName}
                                    </Text>

                                    <Text style={[styles.cellText, styles.cellDate]}>{doc.dateUpload}</Text>

                                    <View style={styles.cellStatus}>
                                        <View style={[styles.statusBadge, styles.statusBadgePending]}>
                                            <Text style={styles.statusBadgeText}>{getStatusLabel(doc.verifState)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cellActions}>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleSelectDoc(doc)}>
                                            <Text style={styles.actionButtonText}>{t('view')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {!isLoading && filteredDocuments.length === 0 && (
                                <Text style={{ marginTop: 16, color: "#6B7280" }}>
                                    {t('noDocsFound')}
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>

            {isDetailOpen && selectedDoc && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={styles.modalTitle}>{t('docDetails')}</Text>
                            <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailInfoBlock}>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailLabel}>{t('association')}</Text>
                                <Text style={styles.detailValue} numberOfLines={1}>
                                    {selectedDoc.assoName}
                                </Text>
                            </View>

                            <View style={styles.detailLine}>
                                <Text style={styles.detailLabel}>{t('rnaCode')}</Text>
                                <Text style={styles.detailValue}>{selectedDoc.rnaCode}</Text>
                            </View>

                            <View style={styles.detailLine}>
                                <Text style={styles.detailLabel}>{t('fileName')}</Text>
                                <Text style={styles.detailValue} numberOfLines={1}>
                                    {selectedDoc.docName}
                                </Text>
                            </View>

                            <View style={styles.detailLine}>
                                <Text style={styles.detailLabel}>{t('uploadDate')}</Text>
                                <Text style={styles.detailValue}>{selectedDoc.dateUpload}</Text>
                            </View>
                        </View>

                        {/* ✅ APERÇU via presigned preview URL */}
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewTitle}>{t('docPreview')}</Text>

                            {previewLoading ? (
                                <View style={{ marginTop: 10 }}>
                                    <ActivityIndicator />
                                </View>
                            ) : previewError ? (
                                <View style={styles.previewPage}>
                                    <Text style={styles.previewHint}>{previewError}</Text>
                                </View>
                            ) : !previewUrl ? (
                                <View style={styles.previewPage}>
                                    <Text style={styles.previewHint}>{t('noPreview')}</Text>
                                </View>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(previewUrl)}
                                        style={{ marginBottom: 12, alignSelf: "flex-start" }}
                                    >
                                        <Text style={{ textDecorationLine: "underline" }}>
                                            {t('openDocNewTab')}
                                        </Text>
                                    </TouchableOpacity>

                                    <View style={styles.previewPage}>
                                        {Platform.OS === "web" ? (
                                            // @ts-ignore
                                            <iframe
                                                src={previewUrl}
                                                title="document-preview"
                                                style={{
                                                    width: "100%",
                                                    height: 260,
                                                    border: "0px",
                                                    borderRadius: 12,
                                                }}
                                            />
                                        ) : (
                                            <NativeWebView
                                                source={{ uri: previewUrl }}
                                                style={{ height: 260, width: "100%", borderRadius: 12 }}
                                            />
                                        )}
                                    </View>
                                </>
                            )}
                        </View>

                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity style={styles.rejectButton} onPress={handleReject} disabled={isLoading}>
                                <Text style={styles.rejectButtonText}>{t('reject')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} disabled={isLoading}>
                                <Text style={styles.acceptButtonText}>{t('acceptDoc')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
