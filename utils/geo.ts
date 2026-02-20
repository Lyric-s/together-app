export type Coords = { lat: number; lon: number };

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const toRad = (v: number) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistance(km: number) {
    if (!Number.isFinite(km)) return "";
    const meters = km * 1000;
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${km.toFixed(1).replace(".", ",")} km`;
}
