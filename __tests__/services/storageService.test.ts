import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageService } from "@/services/storageService";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => {
    const store: Record<string, string> = {};
    return {
        __esModule: true,
        default: {
            multiSet: jest.fn(async (pairs: [string, string][]) => {
                for (const [k, v] of pairs) store[k] = v;
            }),
            getItem: jest.fn(async (k: string) => (k in store ? store[k] : null)),
            setItem: jest.fn(async (k: string, v: string) => {
                store[k] = v;
            }),
            removeItem: jest.fn(async (k: string) => {
                delete store[k];
            }),
            multiRemove: jest.fn(async (keys: string[]) => {
                for (const k of keys) delete store[k];
            }),
            __store: store,
        },
    };
});

describe("services/storageService", () => {
    const asMock = AsyncStorage as unknown as {
        getItem: jest.Mock;
        setItem: jest.Mock;
        removeItem: jest.Mock;
        multiSet: jest.Mock;
        multiRemove: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("saveTokens stores access_token + refresh_token", async () => {
        await storageService.saveTokens("A", "R");
        await expect(storageService.getAccessToken()).resolves.toBe("A");
        await expect(storageService.getRefreshToken()).resolves.toBe("R");
    });

    test("setItem/getItem/removeItem works", async () => {
        await storageService.setItem("k", "v");
        await expect(storageService.getItem("k")).resolves.toBe("v");
        await storageService.removeItem("k");
        await expect(storageService.getItem("k")).resolves.toBeNull();
    });

    test("getItem returns null on error", async () => {
        asMock.getItem.mockRejectedValueOnce(new Error("boom"));
        await expect(storageService.getItem("x")).resolves.toBeNull();
    });

    test("clear removes known keys", async () => {
        await storageService.saveTokens("A", "R");
        await storageService.setItem("cached_user", "u");
        await storageService.setItem("user_type", "admin");

        await storageService.clear();

        await expect(storageService.getAccessToken()).resolves.toBeNull();
        await expect(storageService.getRefreshToken()).resolves.toBeNull();
        await expect(storageService.getItem("cached_user")).resolves.toBeNull();
        await expect(storageService.getItem("user_type")).resolves.toBeNull();
    });
});
