import { useColorScheme } from "@/hooks/use-color-scheme";

describe("hooks/use-color-scheme", () => {
    test("returns a valid scheme or null/undefined", () => {
        const v = useColorScheme();
        expect(["light", "dark", null, undefined]).toContain(v as any);
    });
});
