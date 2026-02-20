/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("@/services/apiErrorHandler", () => ({
    __esModule: true,
    handleApiError: jest.fn(),
}));

import api from "@/services/api";
import { handleApiError } from "@/services/apiErrorHandler";
import { associationService } from "@/services/associationService";

type ApiMock = {
    get: jest.Mock;
    post: jest.Mock;
    patch: jest.Mock;
    delete: jest.Mock;
};

describe("services/associationService", () => {
    const apiMock = api as unknown as ApiMock;
    const handleApiErrorMock = handleApiError as unknown as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
        jest.useRealTimers();
    });

    // ======================
    // Associations CRUD
    // ======================

    test("getAll calls GET /associations/ and returns data", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

        const res = await associationService.getAll();

        expect(apiMock.get).toHaveBeenCalledWith("/associations/");
        expect(res).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test("getAll calls handleApiError on failure", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        await expect(associationService.getAll()).resolves.toBeUndefined();
        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
    });

    test("getById calls GET /associations/{id} and returns data", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { id: 7, name: "Asso" } });

        const res = await associationService.getById(7);

        expect(apiMock.get).toHaveBeenCalledWith("/associations/7");
        expect(res).toEqual({ id: 7, name: "Asso" });
    });

    test("getById calls handleApiError and rethrows original error", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        await expect(associationService.getById(7)).rejects.toBe(err);
        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
    });

    test("getMe calls GET /associations/me and returns data", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { id: 1, name: "Me" } });

        const res = await associationService.getMe();

        expect(apiMock.get).toHaveBeenCalledWith("/associations/me");
        expect(res).toEqual({ id: 1, name: "Me" });
    });

    test("create calls POST /associations/ with user_in + association_in", async () => {
        apiMock.post.mockResolvedValueOnce({ data: { id: 1 } });

        const userIn = { email: "a@b.com" } as any;
        const associationIn = { name: "Asso" } as any;

        const res = await associationService.create(userIn, associationIn);

        expect(apiMock.post).toHaveBeenCalledWith("/associations/", {
            user_in: userIn,
            association_in: associationIn,
        });
        expect(res).toEqual({ id: 1 });
    });

    test("update calls PATCH /associations/{id} with payload", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { id: 5, name: "Updated" } });

        const payload = { name: "Updated" } as any;
        const res = await associationService.update(5, payload);

        expect(apiMock.patch).toHaveBeenCalledWith("/associations/5", payload);
        expect(res).toEqual({ id: 5, name: "Updated" });
    });

    test("delete calls DELETE /associations/{id}", async () => {
        apiMock.delete.mockResolvedValueOnce({});

        await associationService.delete(9);

        expect(apiMock.delete).toHaveBeenCalledWith("/associations/9");
    });

    test("delete calls handleApiError on failure", async () => {
        const err = new Error("boom");
        apiMock.delete.mockRejectedValueOnce(err);

        await expect(associationService.delete(9)).resolves.toBeUndefined();
        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
    });

    // ======================
    // Missions
    // ======================

    test("getMyMissions calls GET /associations/me/missions and returns data", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

        const res = await associationService.getMyMissions();

        expect(apiMock.get).toHaveBeenCalledWith("/associations/me/missions");
        expect(res).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test("getMyMissions returns [] on error and calls handleApiError", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        const res = await associationService.getMyMissions();

        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
        expect(res).toEqual([]);
    });

    test("getMyFinishedMissions filters missions with date_end in the past", async () => {
        // Freeze time so test is deterministic
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-02-20T12:00:00.000Z"));

        apiMock.get.mockResolvedValueOnce({
            data: [
                { id: 1, date_end: "2026-02-01T00:00:00.000Z" }, // past
                { id: 2, date_end: "2026-02-20T12:00:00.000Z" }, // equal -> not < today
                { id: 3, date_end: "2026-03-01T00:00:00.000Z" }, // future
            ],
        });

        const res = await associationService.getMyFinishedMissions();

        expect(apiMock.get).toHaveBeenCalledWith("/associations/me/missions");
        expect(res.map((m: any) => m.id)).toEqual([1]);
    });

    test("getMyFinishedMissions returns [] on error and calls handleApiError", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        const res = await associationService.getMyFinishedMissions();

        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
        expect(res).toEqual([]);
    });

    test("createMission calls POST /associations/me/missions with payload", async () => {
        apiMock.post.mockResolvedValueOnce({ data: { id: 11 } });

        const payload = { title: "M1" } as any;
        const res = await associationService.createMission(payload);

        expect(apiMock.post).toHaveBeenCalledWith("/associations/me/missions", payload);
        expect(res).toEqual({ id: 11 });
    });

    test("updateMission calls PATCH /associations/me/missions/{id} with payload", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { id: 22 } });

        const payload = { title: "New" } as any;
        const res = await associationService.updateMission(22, payload);

        expect(apiMock.patch).toHaveBeenCalledWith("/associations/me/missions/22", payload);
        expect(res).toEqual({ id: 22 });
    });

    test("deleteMission calls DELETE /associations/me/missions/{id}", async () => {
        apiMock.delete.mockResolvedValueOnce({});

        await associationService.deleteMission(33);

        expect(apiMock.delete).toHaveBeenCalledWith("/associations/me/missions/33");
    });

    // ======================
    // Notifications
    // ======================

    test("getNotifications calls GET /associations/notifications with params", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await associationService.getNotifications(0, 20, true);

        expect(apiMock.get).toHaveBeenCalledWith("/associations/notifications", {
            params: { unread_only: true, offset: 0, limit: 20 },
        });
        expect(res).toEqual([{ id: 1 }]);
    });

    test("getNotifications calls handleApiError on error", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        await expect(associationService.getNotifications(0, 20, true)).resolves.toBeUndefined();
        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
    });

    // ======================
    // Engagement approvals / rejections
    // ======================

    test("approveEngagement calls PATCH approve endpoint and returns data", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { id: 1, status: "APPROVED" } });

        const res = await associationService.approveEngagement(10, 20);

        expect(apiMock.patch).toHaveBeenCalledWith(
            "/associations/me/engagements/10/20/approve"
        );
        expect(res).toEqual({ id: 1, status: "APPROVED" });
    });

    test("rejectEngagement calls PATCH reject endpoint with rejection_reason", async () => {
        apiMock.patch.mockResolvedValueOnce({ data: { id: 1, status: "REJECTED" } });

        const res = await associationService.rejectEngagement(10, 20, "not fit");

        expect(apiMock.patch).toHaveBeenCalledWith(
            "/associations/me/engagements/10/20/reject",
            { rejection_reason: "not fit" }
        );
        expect(res).toEqual({ id: 1, status: "REJECTED" });
    });

    // ======================
    // getMissionEngagements (with optional status)
    // ======================

    test("getMissionEngagements calls GET engagements with no status param when omitted", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ volunteer_id: 1 }] });

        const res = await associationService.getMissionEngagements(55);

        expect(apiMock.get).toHaveBeenCalledWith(
            "/associations/me/missions/55/engagements",
            { params: {} }
        );
        expect(res).toEqual([{ volunteer_id: 1 }]);
    });

    test("getMissionEngagements calls GET engagements with status param when provided", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ volunteer_id: 1 }] });

        const res = await associationService.getMissionEngagements(55, "PENDING" as any);

        expect(apiMock.get).toHaveBeenCalledWith(
            "/associations/me/missions/55/engagements",
            { params: { status: "PENDING" } }
        );
        expect(res).toEqual([{ volunteer_id: 1 }]);
    });

    test("getMissionEngagements returns [] on error and calls handleApiError", async () => {
        const err = new Error("boom");
        apiMock.get.mockRejectedValueOnce(err);

        const res = await associationService.getMissionEngagements(55, "APPROVED" as any);

        expect(handleApiErrorMock).toHaveBeenCalledWith(err);
        expect(res).toEqual([]);
    });
});