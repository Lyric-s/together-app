/* eslint-disable @typescript-eslint/no-var-requires */
import { AxiosError } from "axios";

// ✅ Mock the api axios instance used by adminService
jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
    },
}));

// ✅ Mock formatMonthLabel so mapping is deterministic
jest.mock("@/models/admin.model", () => {
    const actual = jest.requireActual("@/models/admin.model");
    return {
        __esModule: true,
        ...actual,
        formatMonthLabel: jest.fn((m: string) => `FMT(${m})`),
    };
});

import api from "@/services/api";
import { adminService } from "@/services/adminService";
import { formatMonthLabel } from "@/models/admin.model";

type ApiMock = {
    get: jest.Mock;
    post: jest.Mock;
    patch: jest.Mock;
};

function makeAxiosError(message: string, data?: any, status = 400) {
    // AxiosError constructor exists in axios v1+, but easiest is to create a real AxiosError instance
    const err = new AxiosError(message) as AxiosError & {
        response?: any;
    };
    err.response = { status, data };
    return err;
}

describe("services/adminService", () => {
    const apiMock = api as unknown as ApiMock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    // =========================
    // BASIC PROFILE ENDPOINTS
    // =========================

    test("getMe calls GET /admin/me and returns data", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { id: 1, email: "a@b.com" } });

        const res = await adminService.getMe();

        expect(apiMock.get).toHaveBeenCalledWith("/admin/me");
        expect(res).toEqual({ id: 1, email: "a@b.com" });
    });

    test("updateProfile calls PATCH /admin/{id} with body and returns data", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { ok: true } });

        const res = await adminService.updateProfile(42, { first_name: "Momo" } as any);

        expect(apiMock.patch).toHaveBeenCalledWith("/admin/42", { first_name: "Momo" });
        expect(res).toEqual({ ok: true });
    });

    // =========================
    // VOLUNTEERS
    // =========================

    test("getAllVolunteers calls GET /volunteers/ with offset/limit params", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

        const res = await adminService.getAllVolunteers(10, 50);

        expect(apiMock.get).toHaveBeenCalledWith("/volunteers/", {
            params: { offset: 10, limit: 50 },
        });
        expect(res).toEqual([{ id: 1 }, { id: 2 }]);
    });

    // =========================
    // DOCUMENTS
    // =========================

    test("getAllDocuments calls GET /internal/admin/documents with params", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await adminService.getAllDocuments(5, 20);

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/documents", {
            params: { offset: 5, limit: 20 },
        });
        expect(res).toEqual([{ id: 1 }]);
    });

    test("approveDocument calls POST /internal/admin/documents/{id}/approve", async () => {
        apiMock.post.mockResolvedValueOnce({ data: { id: 99, state: "approved" } });

        const res = await adminService.approveDocument(99);

        expect(apiMock.post).toHaveBeenCalledWith("/internal/admin/documents/99/approve");
        expect(res).toEqual({ id: 99, state: "approved" });
    });

    test("rejectDocument calls POST reject with empty body when no reason", async () => {
        apiMock.post.mockResolvedValueOnce({ data: { id: 10, state: "rejected" } });

        const res = await adminService.rejectDocument(10);

        expect(apiMock.post).toHaveBeenCalledWith("/internal/admin/documents/10/reject", {});
        expect(res).toEqual({ id: 10, state: "rejected" });
    });

    test("rejectDocument calls POST reject with rejection_reason when reason provided", async () => {
        apiMock.post.mockResolvedValueOnce({ data: { id: 10, state: "rejected" } });

        const res = await adminService.rejectDocument(10, "blurred");

        expect(apiMock.post).toHaveBeenCalledWith("/internal/admin/documents/10/reject", {
            rejection_reason: "blurred",
        });
        expect(res).toEqual({ id: 10, state: "rejected" });
    });

    test("getPendingDocuments calls GET /internal/admin/documents/pending", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

        const res = await adminService.getPendingDocuments();

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/documents/pending");
        expect(res).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test("getAdminDocumentPreviewUrl calls GET preview-url endpoint", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { preview_url: "x", expires_in: 60 } });

        const res = await adminService.getAdminDocumentPreviewUrl(7);

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/documents/7/preview-url");
        expect(res).toEqual({ preview_url: "x", expires_in: 60 });
    });

    test("getAdminDocumentDownloadUrl calls GET download-url endpoint", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { download_url: "y", expires_in: 60 } });

        const res = await adminService.getAdminDocumentDownloadUrl(7);

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/documents/7/download-url");
        expect(res).toEqual({ download_url: "y", expires_in: 60 });
    });

    // =========================
    // ASSOCIATIONS (INTERNAL ADMIN)
    // =========================

    test("getAllAssociationsInternal calls GET /internal/admin/associations", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await adminService.getAllAssociationsInternal();

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/associations");
        expect(res).toEqual([{ id: 1 }]);
    });

    // =========================
    // REPORTS (INTERNAL ADMIN)
    // =========================

    test("getReports uses default offset/limit when params empty", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await adminService.getReports();

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/reports", {
            params: { offset: 0, limit: 100 },
        });
        expect(res).toEqual([{ id: 1 }]);
    });

    test("getReports passes offset/limit when provided", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await adminService.getReports({ offset: 20, limit: 5 } as any);

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/reports", {
            params: { offset: 20, limit: 5 },
        });
        expect(res).toEqual([{ id: 1 }]);
    });

    test("updateReportState calls PATCH /internal/admin/reports/{id} with {state}", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { id: 3, state: "processed" } });

        const res = await adminService.updateReportState(3, "processed" as any);

        expect(apiMock.patch).toHaveBeenCalledWith("/internal/admin/reports/3", {
            state: "processed",
        });
        expect(res).toEqual({ id: 3, state: "processed" });
    });

    // =========================
    // STATS ENDPOINTS + "Swagger bug"
    // =========================

    test("getReportStats throws if API returns string (swagger bug) -> normalized error", async () => {
        apiMock.get.mockResolvedValueOnce({ data: "oops" });

        await expect(adminService.getReportStats()).rejects.toThrow(
            "Erreur inattendue de connexion."
        );
        // Explanation: it throws new Error(...) inside try, not AxiosError, so handleApiError => generic
    });

    test("getReportStats returns data when object", async () => {
        const payload = { total: 10 } as any;
        apiMock.get.mockResolvedValueOnce({ data: payload });

        const res = await adminService.getReportStats();

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/reports/stats");
        expect(res).toEqual(payload);
    });

    test("getDashboardOverview throws if API returns string", async () => {
        apiMock.get.mockResolvedValueOnce({ data: "bad" });

        await expect(adminService.getDashboardOverview()).rejects.toThrow(
            "Erreur inattendue de connexion."
        );
    });

    test("getDashboardOverview returns data when object", async () => {
        const payload = {
            total_validated_associations: 1,
            total_completed_missions: 2,
            total_users: 3,
            pending_reports_count: 4,
            pending_associations_count: 5,
        } as any;
        apiMock.get.mockResolvedValueOnce({ data: payload });

        const res = await adminService.getDashboardOverview();

        expect(apiMock.get).toHaveBeenCalledWith("/internal/admin/stats/overview");
        expect(res).toEqual(payload);
    });

    test("getVolunteersByMonth calls endpoint with params and maps month using formatMonthLabel", async () => {
        (formatMonthLabel as unknown as jest.Mock).mockClear();
        apiMock.get.mockResolvedValueOnce({
            data: [{ month: "2026-01", value: 12 }],
        });

        const res = await adminService.getVolunteersByMonth(9);

        expect(apiMock.get).toHaveBeenCalledWith(
            "/internal/admin/stats/volunteers-by-month",
            { params: { months: 9 } }
        );
        expect(formatMonthLabel).toHaveBeenCalledWith("2026-01");
        expect(res).toEqual([{ month: "FMT(2026-01)", value: 12 }]);
    });

    test("getVolunteersByMonth throws if API returns string", async () => {
        apiMock.get.mockResolvedValueOnce({ data: "oops" });

        await expect(adminService.getVolunteersByMonth()).rejects.toThrow(
            "Erreur inattendue de connexion."
        );
    });

    test("getMissionsByMonth calls endpoint with params and maps month using formatMonthLabel", async () => {
        (formatMonthLabel as unknown as jest.Mock).mockClear();
        apiMock.get.mockResolvedValueOnce({
            data: [
                { month: "2026-01", value: 2 },
                { month: "2026-02", value: 5 },
            ],
        });

        const res = await adminService.getMissionsByMonth(7);

        expect(apiMock.get).toHaveBeenCalledWith(
            "/internal/admin/stats/missions-by-month",
            { params: { months: 7 } }
        );
        expect(formatMonthLabel).toHaveBeenCalledWith("2026-01");
        expect(formatMonthLabel).toHaveBeenCalledWith("2026-02");
        expect(res).toEqual([
            { month: "FMT(2026-01)", value: 2 },
            { month: "FMT(2026-02)", value: 5 },
        ]);
    });

    test("getMissionsByMonth throws if API returns string", async () => {
        apiMock.get.mockResolvedValueOnce({ data: "oops" });

        await expect(adminService.getMissionsByMonth()).rejects.toThrow(
            "Erreur inattendue de connexion."
        );
    });

    // =========================
    // getDashboardStats aggregation
    // =========================

    test("getDashboardStats aggregates overview + volunteers + missions", async () => {
        // Mock internal calls instead of api.get directly
        const overview = {
            total_validated_associations: 10,
            total_completed_missions: 20,
            total_users: 30,
            pending_reports_count: 2,
            pending_associations_count: 3,
        } as any;

        jest.spyOn(adminService, "getDashboardOverview").mockResolvedValueOnce(overview);
        jest.spyOn(adminService, "getVolunteersByMonth").mockResolvedValueOnce([
            { month: "FMT(2026-01)", value: 1 },
        ] as any);
        jest.spyOn(adminService, "getMissionsByMonth").mockResolvedValueOnce([
            { month: "FMT(2026-01)", value: 2 },
        ] as any);

        const res = await adminService.getDashboardStats(12);

        expect(adminService.getDashboardOverview).toHaveBeenCalled();
        expect(adminService.getVolunteersByMonth).toHaveBeenCalledWith(12);
        expect(adminService.getMissionsByMonth).toHaveBeenCalledWith(12);

        expect(res).toEqual({
            associationsCount: 10,
            completedMissionsCount: 20,
            usersCount: 30,
            pendingReportsCount: 2,
            pendingAssociationsCount: 3,
            volunteersPerMonth: [{ month: "FMT(2026-01)", value: 1 }],
            missionsPerMonth: [{ month: "FMT(2026-01)", value: 2 }],
        });
    });

    test("getDashboardStats: if any subcall fails with AxiosError, it rethrows normalized message", async () => {
        jest.spyOn(adminService, "getDashboardOverview").mockRejectedValueOnce(
            makeAxiosError("boom", { detail: "Backend says no" }, 500)
        );

        await expect(adminService.getDashboardStats()).rejects.toThrow("Backend says no");
        expect(console.error).toHaveBeenCalled(); // from handleApiError
    });

    // =========================
    // handleApiError behavior via service methods
    // =========================

    test("AxiosError with response.data.detail is normalized and thrown as Error(detail)", async () => {
        apiMock.get.mockRejectedValueOnce(makeAxiosError("X", { detail: "Nope" }, 401));

        await expect(adminService.getMe()).rejects.toThrow("Nope");
        expect(console.error).toHaveBeenCalledWith("API Error:", "Nope");
    });

    test("AxiosError falls back to response.data.message if detail missing", async () => {
        apiMock.get.mockRejectedValueOnce(makeAxiosError("X", { message: "Msg" }, 400));

        await expect(adminService.getMe()).rejects.toThrow("Msg");
    });

    test("AxiosError falls back to error.message if no detail/message", async () => {
        apiMock.get.mockRejectedValueOnce(makeAxiosError("Just message", undefined, 400));

        await expect(adminService.getMe()).rejects.toThrow("Just message");
    });

    test("Non-Axios errors become generic connection error", async () => {
        apiMock.get.mockRejectedValueOnce(new Error("random"));

        await expect(adminService.getMe()).rejects.toThrow("Erreur inattendue de connexion.");
    });
});