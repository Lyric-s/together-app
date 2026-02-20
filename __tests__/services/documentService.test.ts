import api from "@/services/api";
import { documentService } from "@/services/documentService";
import { Platform } from "react-native";

jest.mock("@/services/api", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

describe("services/documentService", () => {
    const apiMock = api as jest.Mocked<typeof api>;

    const okResponse = (id: number) => ({
        data: {
            id_doc: id,
            doc_name: "Doc",
            url_doc: "https://x",
            id_asso: 2,
            verif_state: "PENDING",
            rejection_reason: null,
            date_uploaded: "2026-02-20",
        },
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
        // reset fetch
        delete (global as any).fetch;
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    test("WEB: uploads with direct File object when Platform.OS=web and file.file exists", async () => {
        Object.defineProperty(Platform, "OS", { value: "web" });

        apiMock.post.mockResolvedValueOnce(okResponse(1) as any);

        const fakeFileObj = new Blob(["hello"], { type: "application/pdf" }) as any;
        const picked = {
            uri: "blob:xxx",
            name: "test.pdf",
            mimeType: "application/pdf",
            file: fakeFileObj,
        };

        const res = await documentService.uploadValidationDocument(picked as any, "Kbis");

        expect(apiMock.post).toHaveBeenCalledTimes(1);
        const [url, body] = (apiMock.post as jest.Mock).mock.calls[0];
        expect(url).toBe("/documents/upload");
        expect(body).toBeInstanceOf(FormData);
        expect(res.id_doc).toBe(1);
    });

    test("WEB: uploads by fetching blob when Platform.OS=web and file.file missing", async () => {
        Object.defineProperty(Platform, "OS", { value: "web" });

        apiMock.post.mockResolvedValueOnce(okResponse(2) as any);

        // IMPORTANT: retourner un vrai Blob
        (global as any).fetch = jest.fn().mockResolvedValue({
            blob: jest.fn().mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" })),
        });

        const picked = {
            uri: "blob:from-uri",
            name: "fallback.pdf",
            mimeType: "application/pdf",
            // file absent => fallback
        };

        const res = await documentService.uploadValidationDocument(picked as any, "ID");

        expect((global as any).fetch).toHaveBeenCalledWith("blob:from-uri");
        expect(apiMock.post).toHaveBeenCalledTimes(1);

        const [url, body] = (apiMock.post as jest.Mock).mock.calls[0];
        expect(url).toBe("/documents/upload");
        expect(body).toBeInstanceOf(FormData);

        expect(res.id_doc).toBe(2);
    });

    test("MOBILE: uploads with {uri,name,type} payload when Platform.OS != web", async () => {
        Object.defineProperty(Platform, "OS", { value: "android" });

        apiMock.post.mockResolvedValueOnce(okResponse(3) as any);

        const picked = {
            uri: "file:///path/document.pdf",
            name: "document.pdf",
            mimeType: "application/pdf",
        };

        const res = await documentService.uploadValidationDocument(picked as any, "Justif");

        expect(apiMock.post).toHaveBeenCalledTimes(1);
        const [url, body] = (apiMock.post as jest.Mock).mock.calls[0];

        expect(url).toBe("/documents/upload");
        expect(body).toBeInstanceOf(FormData);
        expect(res.id_doc).toBe(3);
    });

    test("throws and logs when api.post rejects", async () => {
        Object.defineProperty(Platform, "OS", { value: "android" });

        apiMock.post.mockRejectedValueOnce(new Error("boom"));

        await expect(
            documentService.uploadValidationDocument(
                { uri: "file:///x", name: "x.pdf", mimeType: "application/pdf" } as any,
                "Doc"
            )
        ).rejects.toThrow("boom");

        expect(console.error).toHaveBeenCalled();
    });
});