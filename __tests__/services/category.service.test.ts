import api from "@/services/api";
import { categoryService } from "@/services/category.service";

jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

describe("services/category.service", () => {
    const apiMock = api as jest.Mocked<typeof api>;

    beforeEach(() => jest.clearAllMocks());

    test("getAll returns categories", async () => {
        apiMock.get.mockResolvedValueOnce({ data: [{ id_categ: 1, name: "A" }] } as any);
        const res = await categoryService.getAll();
        expect(apiMock.get).toHaveBeenCalled();
        expect(res).toEqual([{ id_categ: 1, name: "A" }]);
    });
});
