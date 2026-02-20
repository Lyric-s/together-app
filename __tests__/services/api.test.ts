/* eslint-disable @typescript-eslint/no-var-requires */

type AnyObj = Record<string, any>;

function makeAxiosMock() {
    let createdConfig: AnyObj | null = null;

    let reqFulfilled: ((cfg: AnyObj) => any) | null = null;
    let reqRejected: ((err: any) => any) | null = null;

    let resFulfilled: ((resp: any) => any) | null = null;
    let resRejected: ((err: any) => any) | null = null;

    const apiInstance: any = jest.fn(async (cfg: AnyObj) => ({
        data: { ok: true },
        config: cfg,
    }));

    const create = jest.fn((cfg: AnyObj) => {
        createdConfig = cfg;

        apiInstance.interceptors = {
            request: {
                use: jest.fn((f: any, r: any) => {
                    reqFulfilled = f;
                    reqRejected = r;
                }),
            },
            response: {
                use: jest.fn((f: any, r: any) => {
                    resFulfilled = f;
                    resRejected = r;
                }),
            },
        };

        return apiInstance;
    });

    return {
        create,
        apiInstance,
        get createdConfig() {
            return createdConfig;
        },
        get reqFulfilled() {
            return reqFulfilled!;
        },
        get reqRejected() {
            return reqRejected!;
        },
        get resFulfilled() {
            return resFulfilled!;
        },
        get resRejected() {
            return resRejected!;
        },
    };
}

describe("services/api", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});

        process.env.EXPO_PUBLIC_API_URL = "https://api.example.test";

        delete (global as any).window;
        (global as any).__DEV__ = true;
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        (console.warn as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });

    test("creates axios instance with baseURL from EXPO_PUBLIC_API_URL", () => {
        const axiosMock = makeAxiosMock();

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue(null),
                clear: jest.fn(),
            },
        }));

        let api: any;
        jest.isolateModules(() => {
            api = require("@/services/api").default;
        });

        expect(axiosMock.create).toHaveBeenCalledTimes(1);
        expect(axiosMock.createdConfig!.baseURL).toBe("https://api.example.test");
        expect(axiosMock.createdConfig!.timeout).toBe(10000);
        expect(
            axiosMock.createdConfig!.headers["Content-Type"]
        ).toBe("application/json");

        expect(typeof api).toBe("function");
    });

    test("request interceptor adds Authorization header when token exists", async () => {
        const axiosMock = makeAxiosMock();
        const getAccessToken = jest.fn().mockResolvedValue("TOKEN123");

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken,
                clear: jest.fn(),
            },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const cfg = { headers: {} as AnyObj };
        const out = await axiosMock.reqFulfilled(cfg);

        expect(getAccessToken).toHaveBeenCalled();
        expect(out.headers.Authorization).toBe("Bearer TOKEN123");
    });

    test("response interceptor: 422 logs warn and rejects", async () => {
        const axiosMock = makeAxiosMock();

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue(null),
                clear: jest.fn(),
            },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const err = {
            config: { url: "/x", headers: {} },
            response: { status: 422, data: { detail: "bad" } },
        };

        await expect(axiosMock.resRejected(err as any)).rejects.toBe(err);
        expect(console.warn).toHaveBeenCalled();
    });

    test("response interceptor: if refresh endpoint fails, clears storage and rejects", async () => {
        const axiosMock = makeAxiosMock();
        const clear = jest.fn().mockResolvedValue(undefined);

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue(null),
                clear,
            },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const err = {
            config: { url: "/auth/refresh", headers: {} },
            response: { status: 401 },
        };

        await expect(axiosMock.resRejected(err as any)).rejects.toBe(err);
        expect(clear).toHaveBeenCalled();
    });

    test("response interceptor: 401 triggers refresh then retries original request", async () => {
        const axiosMock = makeAxiosMock();
        const clear = jest.fn().mockResolvedValue(undefined);
        const refresh = jest.fn().mockResolvedValue("NEW_TOKEN");

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue("OLD"),
                clear,
            },
        }));

        jest.doMock("@/services/authService", () => ({
            authService: { refresh },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const originalRequest = { url: "/protected", headers: {} as AnyObj };

        const err = {
            config: originalRequest,
            response: { status: 401 },
        };

        const res = await axiosMock.resRejected(err as any);

        expect(refresh).toHaveBeenCalled();
        expect(originalRequest.headers.Authorization).toBe(
            "Bearer NEW_TOKEN"
        );
        expect(axiosMock.apiInstance).toHaveBeenCalledWith(originalRequest);
        expect(res.data.ok).toBe(true);
        expect(clear).not.toHaveBeenCalled();
    });

    test("response interceptor: concurrent 401 while refreshing are queued", async () => {
        const axiosMock = makeAxiosMock();
        const clear = jest.fn().mockResolvedValue(undefined);

        let resolveRefresh!: (t: string) => void;
        const refresh = jest.fn().mockImplementation(
            () =>
                new Promise<string>((resolve) => {
                    resolveRefresh = resolve;
                })
        );

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue("OLD"),
                clear,
            },
        }));

        jest.doMock("@/services/authService", () => ({
            authService: { refresh },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const req1 = { url: "/r1", headers: {} as AnyObj };
        const req2 = { url: "/r2", headers: {} as AnyObj };

        const err1 = { config: req1, response: { status: 401 } };
        const err2 = { config: req2, response: { status: 401 } };

        const p1 = axiosMock.resRejected(err1 as any);
        const p2 = axiosMock.resRejected(err2 as any);

        resolveRefresh("NEW_TOKEN");

        const r1 = await p1;
        const r2 = await p2;

        expect(refresh).toHaveBeenCalledTimes(1);
        expect(req1.headers.Authorization).toBe("Bearer NEW_TOKEN");
        expect(req2.headers.Authorization).toBe("Bearer NEW_TOKEN");
        expect(axiosMock.apiInstance).toHaveBeenCalledWith(req1);
        expect(axiosMock.apiInstance).toHaveBeenCalledWith(req2);
        expect(r1.data.ok).toBe(true);
        expect(r2.data.ok).toBe(true);
        expect(clear).not.toHaveBeenCalled();
    });

    test("response interceptor: refresh failure clears storage and rejects", async () => {
        const axiosMock = makeAxiosMock();
        const clear = jest.fn().mockResolvedValue(undefined);
        const refresh = jest
            .fn()
            .mockRejectedValue(new Error("refresh failed"));

        jest.doMock("axios", () => ({
            __esModule: true,
            default: { create: axiosMock.create },
        }));

        jest.doMock("@/services/storageService", () => ({
            storageService: {
                getAccessToken: jest.fn().mockResolvedValue("OLD"),
                clear,
            },
        }));

        jest.doMock("@/services/authService", () => ({
            authService: { refresh },
        }));

        jest.isolateModules(() => {
            require("@/services/api");
        });

        const originalRequest = { url: "/protected", headers: {} as AnyObj };
        const err = { config: originalRequest, response: { status: 401 } };

        await expect(
            axiosMock.resRejected(err as any)
        ).rejects.toThrow("refresh failed");

        expect(clear).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    });
});