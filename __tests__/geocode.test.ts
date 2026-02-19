// __tests__/geocode.test.ts

import { geocodeAddressNominatim } from "@/utils/geocode";
import { geocodeCache } from "@/utils/geocodeCache";

// ✅ Important: ne pas utiliser "Coords" dans le jest.mock (hoisting)
// on garde des types inline simples
jest.mock("@/utils/geocodeCache", () => {
    const store = new Map<string, { lat: number; lon: number } | null>();

    return {
        geocodeCache: {
            get: jest.fn(async (k: string) => {
                return store.has(k) ? store.get(k) : undefined;
            }),
            set: jest.fn(async (k: string, v: { lat: number; lon: number } | null) => {
                store.set(k, v);
            }),
            withInflight: jest.fn(async (_k: string, fn: () => Promise<{ lat: number; lon: number } | null>) => {
                return fn();
            }),
        },
    };
});

describe("utils/geocode", () => {
    beforeAll(() => {
        // ✅ éviter le bruit dans les logs (test 429)
        jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterAll(() => {
        (console.warn as jest.Mock).mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns null for empty/blank address (no fetch)", async () => {
        await expect(geocodeAddressNominatim("   ")).resolves.toBeNull();
        expect((global as any).fetch).not.toHaveBeenCalled();
    });

    test("returns cached value when cache hit (no fetch)", async () => {
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce({ lat: 1, lon: 2 });

        await expect(geocodeAddressNominatim("Paris")).resolves.toEqual({ lat: 1, lon: 2 });
        expect((global as any).fetch).not.toHaveBeenCalled();
    });

    test("fetches from nominatim, parses lat/lon, and caches result", async () => {
        // cache miss
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);

        (global as any).fetch = jest.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => [{ lat: "48.8566", lon: "2.3522" }],
        }));

        const res = await geocodeAddressNominatim("Paris");

        expect(res).toEqual({ lat: 48.8566, lon: 2.3522 });
        expect(geocodeCache.set).toHaveBeenCalledWith("Paris", { lat: 48.8566, lon: 2.3522 });
    });

    test("returns null and caches null when not found", async () => {
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);

        (global as any).fetch = jest.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => [],
        }));

        const res = await geocodeAddressNominatim("Nowhere");

        expect(res).toBeNull();
        expect(geocodeCache.set).toHaveBeenCalledWith("Nowhere", null);
    });

    test("throws on HTTP error (transient) and does not cache", async () => {
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);
        (geocodeCache.get as jest.Mock).mockResolvedValueOnce(undefined);

        (global as any).fetch = jest.fn(async () => ({
            ok: false,
            status: 429,
            json: async () => ({}),
        }));

        await expect(geocodeAddressNominatim("Paris")).rejects.toThrow("Nominatim HTTP error 429");
        expect(geocodeCache.set).not.toHaveBeenCalled();
    });
});
