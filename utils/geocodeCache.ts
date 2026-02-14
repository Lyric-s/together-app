import { Platform } from "react-native";
import type { Coords } from "./geo";

/**
 * Geocode Cache (Front)
 * - Memory LRU cache (Map)
 * - Optional persistence:
 *    - Web: localStorage
 *    - Native: AsyncStorage (if installed)
 * - TTL (positive + negative)
 * - Inflight de-dup (same key -> one fetch)
 * - Normalization of keys
 */

export type CacheEntry = {
    coords: Coords | null; // null = "not found" cached
    ts: number;            // timestamp ms
    hits: number;
};

export type GeocodeCacheOptions = {
    maxEntries: number;       // memory cap (LRU)
    ttlMs: number;            // TTL for valid coords
    negativeTtlMs: number;    // TTL for null coords
    persistKey: string;       // storage key
};

const DEFAULT_OPTS: GeocodeCacheOptions = {
    maxEntries: 250,
    ttlMs: 1000 * 60 * 60 * 24 * 30,      // 30 days
    negativeTtlMs: 1000 * 60 * 60 * 6,    // 6 hours
    persistKey: "together_geocode_cache_v1",
};

// Optional AsyncStorage (native)
let AsyncStorage: any = null;
if (Platform.OS !== "web") {
    try {
        //eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        AsyncStorage = require("@react-native-async-storage/async-storage").default;
    } catch {
        AsyncStorage = null;
    }
}

function now() {
    return Date.now();
}

export function normalizeGeocodeKey(raw: string): string {
    return (raw || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*/g, ",")
        .replace(/[’']/g, "'")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, ""); // remove accents
}

function isExpired(entry: CacheEntry, opts: GeocodeCacheOptions) {
    const age = now() - entry.ts;
    const ttl = entry.coords ? opts.ttlMs : opts.negativeTtlMs;
    return age > ttl;
}

async function storageGetItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
        try {
            return window?.localStorage?.getItem(key) ?? null;
        } catch {
            return null;
        }
    }
    if (AsyncStorage) {
        try {
            return await AsyncStorage.getItem(key);
        } catch {
            return null;
        }
    }
    return null;
}

async function storageSetItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
        try {
            window?.localStorage?.setItem(key, value);
        } catch {}
        return;
    }
    if (AsyncStorage) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch {}
    }
}

export class GeocodeLRUCache {
    private readonly opts: GeocodeCacheOptions;
    private map = new Map<string, CacheEntry>(); // LRU by insertion order
    private inflight = new Map<string, Promise<Coords | null>>();

    private hydrated = false;
    private hydratePromise: Promise<void> | null = null;

    constructor(opts?: Partial<GeocodeCacheOptions>) {
        this.opts = { ...DEFAULT_OPTS, ...(opts || {}) };
    }

    private touch(key: string, entry: CacheEntry) {
        this.map.delete(key);
        this.map.set(key, entry);
    }

    private evictIfNeeded() {
        while (this.map.size > this.opts.maxEntries) {
            const it = this.map.keys().next();
            if (it.done) break;
            this.map.delete(it.value);
        }
    }

    private async hydrateOnce() {
        if (this.hydrated) return;
        if (this.hydratePromise) return this.hydratePromise;

        this.hydratePromise = (async () => {
            const raw = await storageGetItem(this.opts.persistKey);
            if (!raw) {
                this.hydrated = true;
                return;
            }

            try {
                const parsed = JSON.parse(raw) as { entries?: [string, CacheEntry][] };
                const entries = parsed?.entries ?? [];

                // filter expired and sort by ts desc, then cap
                const cleaned: [string, CacheEntry][] = [];
                for (const [k, v] of entries) {
                    // runtime guard (storage can be corrupted)
                    if (!k || !v || typeof v !== "object") continue;
                    if (!Number.isFinite((v as any).ts)) continue;
                    if (isExpired(v, this.opts)) continue;
                    cleaned.push([k, v]);
                }

                cleaned.sort((a, b) => b[1].ts - a[1].ts);

                this.map.clear();
                for (const [k, v] of cleaned.slice(0, this.opts.maxEntries)) {
                    this.map.set(k, v);
                }
            } catch {
                // ignore corrupted storage
            }

            this.hydrated = true;
        })();

        return this.hydratePromise;
    }

    private async persist() {
        // Snapshot full cache. With <=250 entries it's safe.
        const entries = Array.from(this.map.entries());
        try {
            await storageSetItem(this.opts.persistKey, JSON.stringify({ entries }));
        } catch {}
    }

    async get(rawKey: string): Promise<Coords | null | undefined> {
        await this.hydrateOnce();

        const key = normalizeGeocodeKey(rawKey);
        if (!key) return undefined;

        const entry = this.map.get(key);
        if (!entry) return undefined;

        if (isExpired(entry, this.opts)) {
            this.map.delete(key);
            void this.persist();
            return undefined;
        }

        entry.hits = (entry.hits || 0) + 1;
        this.touch(key, entry);
        return entry.coords;
    }

    async set(rawKey: string, coords: Coords | null) {
        await this.hydrateOnce();

        const key = normalizeGeocodeKey(rawKey);
        if (!key) return;

        this.map.set(key, { coords, ts: now(), hits: 1 });
        this.evictIfNeeded();
        void this.persist();
    }

    /**
     * De-dup concurrent requests for the same key.
     * If the same key is being fetched, returns the existing promise.
     */
    async withInflight(rawKey: string, fn: () => Promise<Coords | null>): Promise<Coords | null> {
        await this.hydrateOnce();

        const key = normalizeGeocodeKey(rawKey);
        if (!key) return null;

        const existing = this.inflight.get(key);
        if (existing) return existing;

        const p = (async () => {
            try {
                return await fn();
            } finally {
                this.inflight.delete(key);
            }
        })();

        this.inflight.set(key, p);
        return p;
    }
}

// Single shared instance
export const geocodeCache = new GeocodeLRUCache({
    maxEntries: 250,
    ttlMs: 1000 * 60 * 60 * 24 * 30,
    negativeTtlMs: 1000 * 60 * 60 * 6,
    persistKey: "together_geocode_cache_v1",
});
