import { haversineKm, formatDistance } from "@/utils/geo";

describe("utils/geo", () => {
    test("haversineKm returns 0 for same point", () => {
        expect(haversineKm(48.8566, 2.3522, 48.8566, 2.3522)).toBeCloseTo(0, 6);
    });

    test("haversineKm Paris -> London is realistic (~340km)", () => {
        const km = haversineKm(48.8566, 2.3522, 51.5074, -0.1278);
        expect(km).toBeGreaterThan(300);
        expect(km).toBeLessThan(400);
    });

    test("formatDistance returns empty string for non-finite", () => {
        expect(formatDistance(Number.NaN)).toBe("");
        expect(formatDistance(Number.POSITIVE_INFINITY)).toBe("");
    });

    test("formatDistance formats meters below 1km", () => {
        expect(formatDistance(0.12)).toBe("120 m"); // 120m
    });

    test("formatDistance formats km with one decimal and comma", () => {
        expect(formatDistance(1.25)).toBe("1,3 km");
    });
});
