import api from "@/services/api";
import { missionService } from "@/services/missionService";
import { mapApiToMission } from "@/utils/mission.utils";

jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

jest.mock("@/utils/mission.utils", () => ({
    mapApiToMission: jest.fn((x: any) => ({ ...x, mapped: true })),
}));

describe("services/missionService", () => {
    const apiMock = api as jest.Mocked<typeof api>;
    const mapMock = mapApiToMission as unknown as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAll builds query params correctly and maps results", async () => {
        apiMock.get.mockResolvedValueOnce({
            data: [{ id_mission: 1 }, { id_mission: 2 }],
        } as any);

        const res = await missionService.getAll({
            search: "food",
            country: "FR",
            zip_code: "75000",
            date_available: new Date("2026-02-20T10:00:00.000Z"),
            show_full: false,
            category_ids: [1, 5],
        });

        expect(apiMock.get).toHaveBeenCalledWith("/missions/", {
            params: expect.objectContaining({
                search: "food",
                country: "FR",
                zip_code: "75000",
                show_full: false,
                category_ids: "1,5",
                date_available: "2026-02-20",
            }),
        });

        expect(mapMock).toHaveBeenCalledTimes(2);
        expect(res).toEqual([
            { id_mission: 1, mapped: true },
            { id_mission: 2, mapped: true },
        ]);
    });

    test("getById calls /missions/{id} and maps object", async () => {
        apiMock.get.mockResolvedValueOnce({ data: { id_mission: 99 } } as any);

        const res = await missionService.getById(99);

        expect(apiMock.get).toHaveBeenCalledWith("/missions/99");
        expect(res).toEqual({ id_mission: 99, mapped: true });
    });
});
