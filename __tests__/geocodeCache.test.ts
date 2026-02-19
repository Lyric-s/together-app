// Mock react-native Platform for Jest
jest.mock("react-native", () => ({
    Platform: { OS: "web" },
}));

import { GeocodeLRUCache, normalizeGeocodeKey } from "@/utils/geocodeCache";
import type { Coords } from "@/utils/geo";

describe("utils/geocodeCache", () => {
    beforeEach(() => {
        // localStorage mock (web)
        const store: Record<string, string> = {};
        (global as any).window = {
            localStorage: {
                getItem: (k: string) => (k in store ? store[k] : null),
                setItem: (k: string, v: string) => {
                    store[k] = v;
                },
                removeItem: (k: string) => {
                    delete store[k];
                },
            },
        };
    });

    test("normalizeGeocodeKey trims, lowercases, normalizes spaces/commas, removes accents", () => {
        expect(normalizeGeocodeKey("  10,  Rue  de   l’École  ")).toBe("10,rue de l'ecole");
        expect(normalizeGeocodeKey("PARIS")).toBe("paris");
    });

    test("set/get stores and returns coords, then caches 'null' too", async () => {
        const cache = new GeocodeLRUCache({ maxEntries: 10, persistKey: "test_cache_1" });

        const coords: Coords = { lat: 1, lon: 2 };
        await cache.set("Paris", coords);

        await expect(cache.get("paris")).resolves.toEqual(coords);

        await cache.set("Nowhere", null);
        await expect(cache.get("nowhere")).resolves.toBeNull();
    });

    test("LRU eviction removes oldest when maxEntries exceeded", async () => {
        const cache = new GeocodeLRUCache({ maxEntries: 2, persistKey: "test_cache_2" });

        await cache.set("A", { lat: 1, lon: 1 });
        await cache.set("B", { lat: 2, lon: 2 });
        await cache.set("C", { lat: 3, lon: 3 }); // should evict A

        await expect(cache.get("A")).resolves.toBeUndefined();
        await expect(cache.get("B")).resolves.toEqual({ lat: 2, lon: 2 });
        await expect(cache.get("C")).resolves.toEqual({ lat: 3, lon: 3 });
    });

    test("touch on get makes it most recent (so another key gets evicted)", async () => {
        const cache = new GeocodeLRUCache({ maxEntries: 2, persistKey: "test_cache_3" });

        await cache.set("A", { lat: 1, lon: 1 });
        await cache.set("B", { lat: 2, lon: 2 });

        // Access A => A becomes most recent, B becomes oldest
        await cache.get("A");

        await cache.set("C", { lat: 3, lon: 3 }); // should evict B

        await expect(cache.get("B")).resolves.toBeUndefined();
        await expect(cache.get("A")).resolves.toEqual({ lat: 1, lon: 1 });
        await expect(cache.get("C")).resolves.toEqual({ lat: 3, lon: 3 });
    });

    test("withInflight de-duplicates concurrent calls", async () => {
        const cache = new GeocodeLRUCache({ maxEntries: 10, persistKey: "test_cache_4" });

        let calls = 0;
        const fn = async () => {
            calls += 1;
            // simulate async delay
            await new Promise((r) => setTimeout(r, 20));
            return { lat: 9, lon: 9 };
        };

        const p1 = cache.withInflight("Paris", fn);
        const p2 = cache.withInflight("  paris  ", fn);

        const [r1, r2] = await Promise.all([p1, p2]);
        expect(r1).toEqual({ lat: 9, lon: 9 });
        expect(r2).toEqual({ lat: 9, lon: 9 });
        expect(calls).toBe(1);
    });
});
