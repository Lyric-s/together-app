import type { Coords } from "./geo";
import { geocodeCache } from "./geocodeCache";

// Nominatim endpoint
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// 5 seconds timeout
const FETCH_TIMEOUT_MS = 5000;

async function fetchNominatim(address: string): Promise<Coords | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(address)}`;

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                "User-Agent": "TogetherApp/1.0 (educational project)",
            } as any,
        });


        if (!res.ok) {
            // 429, 500, etc → transient
            throw new Error(`Nominatim HTTP error ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return null;
        }

        return { lat, lon };
    } finally {
        clearTimeout(timeout);
    }
}

export async function geocodeAddressNominatim(rawAddress: string): Promise<Coords | null> {
    const address = (rawAddress || "").trim();
    if (!address) return null;

    // 1) Try cache
    const cached = await geocodeCache.get(address);
    if (cached !== undefined) {
        return cached;
    }

    // 2) De-dup
    return geocodeCache.withInflight(address, async () => {
        const cached2 = await geocodeCache.get(address);
        if (cached2 !== undefined) return cached2;

        try {
            const coords = await fetchNominatim(address);

            //Only cache real results or real "not found"
            await geocodeCache.set(address, coords);

            return coords;
        } catch (error) {
            console.warn("Geocode transient error:", error);
            throw error;
        }
    });
}
