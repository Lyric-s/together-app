import api from "@/services/api";
import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";
import { volunteerService } from "@/services/volunteerService";
import { associationService } from "@/services/associationService";
import { UserType } from "@/models/enums";

jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn(),
    },
}));

jest.mock("@/services/storageService", () => ({
    storageService: {
        saveTokens: jest.fn(),
        setItem: jest.fn(),
        getRefreshToken: jest.fn(),
    },
}));

jest.mock("@/services/volunteerService", () => ({
    volunteerService: { register: jest.fn() },
}));

jest.mock("@/services/associationService", () => ({
    associationService: { create: jest.fn() },
}));

describe("services/authService", () => {
    const apiMock = api as jest.Mocked<typeof api>;
    const storageMock = storageService as jest.Mocked<typeof storageService>;
    const volMock = volunteerService as jest.Mocked<typeof volunteerService>;
    const assoMock = associationService as jest.Mocked<typeof associationService>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
        (console.log as jest.Mock).mockRestore();
    });

    test("login posts x-www-form-urlencoded, saves tokens, stores user_type", async () => {
        apiMock.post.mockResolvedValueOnce({
            data: { access_token: "A", refresh_token: "R", user_type: "admin" },
        } as any);

        const res = await authService.login("admin", "password");

        expect(apiMock.post).toHaveBeenCalledTimes(1);

        const [url, body, cfg] = (apiMock.post as jest.Mock).mock.calls[0];
        expect(url).toBe("/auth/token");
        expect(body).toBe("username=admin&password=password");
        expect(cfg).toEqual({
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        expect(storageMock.saveTokens).toHaveBeenCalledWith("A", "R");
        expect(storageMock.setItem).toHaveBeenCalledWith("user_type", "admin");
        expect(res.access_token).toBe("A");
    });

    test("refresh throws if no refresh token", async () => {
        (storageMock.getRefreshToken as jest.Mock).mockResolvedValueOnce(null);
        await expect(authService.refresh()).rejects.toThrow("No refresh token available");
    });

    test("refresh posts refresh_token, saves tokens, returns access token", async () => {
        (storageMock.getRefreshToken as jest.Mock).mockResolvedValueOnce("OLD_R");

        apiMock.post.mockResolvedValueOnce({
            data: { access_token: "NEW_A", refresh_token: "NEW_R" },
        } as any);

        const token = await authService.refresh();

        expect(apiMock.post).toHaveBeenCalledWith("/auth/refresh", { refresh_token: "OLD_R" });
        expect(storageMock.saveTokens).toHaveBeenCalledWith("NEW_A", "NEW_R");
        expect(token).toBe("NEW_A");
    });

    test("register validates required fields", async () => {
        await expect(
            authService.register({
                email: "",
                username: "u",
                password: "p",
                type: UserType.VOLUNTEER,
            } as any)
        ).rejects.toThrow("Missing required fields");
    });

    test("register rejects invalid email", async () => {
        await expect(
            authService.register({
                email: "badmail",
                username: "u",
                password: "p",
                type: UserType.VOLUNTEER,
            } as any)
        ).rejects.toThrow("Invalid email format");
    });

    test("register VOLUNTEER calls volunteerService.register then auto-login", async () => {
        (volMock.register as jest.Mock).mockResolvedValueOnce(undefined);
        const loginSpy = jest.spyOn(authService, "login").mockResolvedValueOnce({ ok: true } as any);

        const res = await authService.register({
            email: "v@example.com",
            username: "vol",
            password: "pass",
            type: UserType.VOLUNTEER,
            first_name: "A",
            last_name: "B",
            phone_number: "0600000000",
            birthdate: "2000-01-01",
        } as any);

        expect(volMock.register).toHaveBeenCalled();
        expect(loginSpy).toHaveBeenCalledWith("vol", "pass");
        expect(res).toEqual({ ok: true });

        loginSpy.mockRestore();
    });

    test("register ASSOCIATION calls associationService.create then auto-login", async () => {
        (assoMock.create as jest.Mock).mockResolvedValueOnce(undefined);
        const loginSpy = jest.spyOn(authService, "login").mockResolvedValueOnce({ ok: true } as any);

        const res = await authService.register({
            email: "a@example.com",
            username: "asso",
            password: "pass",
            type: UserType.ASSOCIATION,
            name: "N",
            company_name: "C",
            rna_code: "RNA",
            phone_number: "0600000000",
            address: "addr",
            zip_code: "75000",
            country: "FR",
            description: "desc",
        } as any);

        expect(assoMock.create).toHaveBeenCalled();
        expect(loginSpy).toHaveBeenCalledWith("asso", "pass");
        expect(res).toEqual({ ok: true });

        loginSpy.mockRestore();
    });
});
