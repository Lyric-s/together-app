import { bench, describe } from "vitest";
import { haversineKm, formatDistance } from "@/utils/geo";

describe("geo performance", () => {
    bench("haversineKm", () => {
        haversineKm(48.8566, 2.3522, 43.2965, 5.3698);
    });

    bench("formatDistance", () => {
        formatDistance(12.345);
    });
});
