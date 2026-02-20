import { formatMissionDate } from "@/utils/date.utils";
import { normalizePath } from "@/utils/path.utils";

describe("utils/date.utils", () => {
    test("returns null for empty", () => {
        expect(formatMissionDate(undefined)).toBeNull();
        expect(formatMissionDate(null)).toBeNull();
    });

    test("handles YYYY-MM-DD without timezone shift (fr)", () => {
        expect(formatMissionDate("2026-02-20", "fr")).toBe("20/02/2026");
    });

    test("handles YYYY-MM-DD (en)", () => {
        expect(formatMissionDate("2026-02-20", "en")).toBe("2026-02-20");
    });

    test("handles Date object", () => {
        const d = new Date("2026-02-20T10:30:00.000Z");
        const s = formatMissionDate(d, "fr");
        expect(typeof s).toBe("string");
        expect(s).toContain("2026");
    });

    test("invalid Date object => null", () => {
        const bad = new Date("not-a-date");
        expect(formatMissionDate(bad as any, "fr")).toBeNull();
    });
});

describe("utils/path.utils", () => {
    test("normalizePath removes expo-router groups", () => {
        expect(normalizePath("/(volunteer)/home")).toBe("/home");
        expect(normalizePath("/(guest)/search/123")).toBe("/search/123");
    });
});
