/* eslint-disable @typescript-eslint/no-deprecated */
import React, { useEffect } from "react";
import TestRenderer, { act } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageService } from "@/services/storageService";
import { authService } from "@/services/authService";
import { AuthProvider, useAuth } from "@/context/AuthContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

jest.mock("@/services/storageService", () => ({
    storageService: {
        getAccessToken: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
    },
}));

jest.mock("@/services/authService", () => ({
    authService: {
        login: jest.fn(),
        getMe: jest.fn(),
    },
}));


function Consumer({ onValue }: { onValue: (ctx: any) => void }) {
    const ctx = useAuth();
    useEffect(() => {
        onValue(ctx);
        return undefined;
    }, [ctx, onValue]);
    return null;
}

describe("context/AuthContext", () => {
    const storageMock = storageService as jest.Mocked<typeof storageService>;
    const authMock = authService as jest.Mocked<typeof authService>;
    const asMock = AsyncStorage as any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });

    test("init: auto-login admin in DEV when no token, then refetchUser sets user", async () => {
        // init() -> getAccessToken (existingToken)
        // then after login -> getAccessToken (newToken)
        // refetchUser -> getAccessToken (token)
        storageMock.getAccessToken
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce("A_TOKEN")
            .mockResolvedValueOnce("A_TOKEN");

        authMock.login.mockResolvedValueOnce(undefined);

        authMock.getMe.mockResolvedValueOnce({
            data: {
                user_type: "admin",
                profile: {
                    id_user: 1,
                    id_admin: 1,
                    email: "admin@example.com",
                    username: "Admin",
                },
            },
        } as any);

        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <AuthProvider>
                    <Consumer onValue={(v) => (latest = v)} />
                </AuthProvider>
            );
        });

        // auto-login appelé (DEV admin/password)
        expect(authMock.login).toHaveBeenCalled();

        // profil chargé
        expect(latest.user).not.toBeNull();
        expect(latest.userType).toBe("admin");
        expect(storageMock.setItem).toHaveBeenCalledWith(
            "cached_user",
            expect.any(String)
        );
    });

    test("refetchUser: if token missing => user null and guest type", async () => {
        // init: existing token direct => null => refetchUser sets guest
        storageMock.getAccessToken.mockResolvedValue(null);

        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <AuthProvider>
                    <Consumer onValue={(v) => (latest = v)} />
                </AuthProvider>
            );
        });

        expect(latest.user).toBeNull();
        expect(latest.userType).toBe("volunteer_guest");
    });

    test("refetchUser: when getMe fails (non-401) it loads cached_user", async () => {
        storageMock.getAccessToken.mockResolvedValue("A_TOKEN");

        authMock.getMe.mockRejectedValueOnce(new Error("network"));

        const cached = {
            id_user: 9,
            email: "x@y.z",
            username: "Cached",
            user_type: "volunteer",
        };
        asMock.getItem.mockResolvedValueOnce(JSON.stringify(cached));

        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <AuthProvider>
                    <Consumer onValue={(v) => (latest = v)} />
                </AuthProvider>
            );
        });

        expect(latest.user).not.toBeNull();
        expect(latest.user.username).toBe("Cached");
        expect(latest.userType).toBe("volunteer");
    });

    test("logout clears storage and resets user", async () => {
        // init minimal : pas de token
        storageMock.getAccessToken.mockResolvedValue(null);

        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <AuthProvider>
                    <Consumer onValue={(v) => (latest = v)} />
                </AuthProvider>
            );
        });

        await act(async () => {
            await latest.logout();
        });

        expect(storageMock.clear).toHaveBeenCalled();
        expect(asMock.removeItem).toHaveBeenCalledWith("cached_user");
        expect(latest.user).toBeNull();
        expect(latest.userType).toBe("volunteer_guest");
    });
});
