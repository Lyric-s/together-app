import type { Coords } from "./geo";
import { geocodeCache } from "./geocodeCache";

// Nominatim endpoint
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

async function fetchNominatim(address: string): Promise<Coords | null> {
    const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            "User-Agent": "TogetherApp/1.0 (educational project)",
        } as any,
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
}

export async function geocodeAddressNominatim(rawAddress: string): Promise<Coords | null> {
    const address = (rawAddress || "").trim();
    if (!address) return null;

    // 1) Try cache
    const cached = await geocodeCache.get(address);
    if (cached !== undefined) {
        // cached peut etre coord ou null
        return cached;
    }

    // 2) De-dup
    return geocodeCache.withInflight(address, async () => {
        // re-check cache inside inflight
        const cached2 = await geocodeCache.get(address);
        if (cached2 !== undefined) return cached2;

        const coords = await fetchNominatim(address);
        await geocodeCache.set(address, coords); // coords can be null (negative cache)
        return coords;
    });
}
