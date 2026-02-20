import { AxiosError } from "axios";
import { handleApiError } from "@/services/apiErrorHandler";

describe("services/apiErrorHandler", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    function makeAxiosError(data: any, message = "Axios msg") {
        const err = new AxiosError(message) as AxiosError<unknown, any>;
        (err as any).response = { data, status: 400 };
        return err;
    }

    function getThrown(fn: () => void) {
        try {
            fn();
            return null;
        } catch (e: any) {
            return e;
        }
    }

    test("uses response.data.detail when string", () => {
        const err = makeAxiosError({ detail: "Bad request" });

        const thrown = getThrown(() => handleApiError(err));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("Bad request");
        expect(thrown.cause).toBe(err);
    });

    test("uses response.data.detail when array", () => {
        const err = makeAxiosError({ detail: [{ msg: "A" }, { msg: "B" }] });

        const thrown = getThrown(() => handleApiError(err));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("A, B");
        expect(thrown.cause).toBe(err);
    });

    test("uses response.data.message when string", () => {
        const err = makeAxiosError({ message: "Nope" });

        const thrown = getThrown(() => handleApiError(err));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("Nope");
        expect(thrown.cause).toBe(err);
    });

    test("uses response.data directly when string", () => {
        const err = makeAxiosError("Direct string error");

        const thrown = getThrown(() => handleApiError(err));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("Direct string error");
        expect(thrown.cause).toBe(err);
    });

    test("falls back to axios error.message when no response data", () => {
        const err = makeAxiosError(undefined, "Network down");
        (err as any).response = undefined;

        const thrown = getThrown(() => handleApiError(err));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("Network down");
        expect(thrown.cause).toBe(err);
    });

    test("non-Axios error => Unexpected connection error.", () => {
        const thrown = getThrown(() => handleApiError(new Error("x")));
        expect(thrown).not.toBeNull();
        expect(thrown.message).toBe("Unexpected connection error.");
        expect(thrown.cause).toBeInstanceOf(Error);
    });
});
