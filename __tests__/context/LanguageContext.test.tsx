/* eslint-disable @typescript-eslint/no-deprecated */
import React, { useEffect } from "react";
import TestRenderer, { act } from "react-test-renderer";

jest.mock("@/constants/Translations", () => ({
    translations: {
        fr: { hello: "Bonjour {{name}}" },
        en: { hello: "Hello {{name}}" },
    },
}));

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

function Consumer({ onValue }: { onValue: (v: any) => void }) {
    const ctx = useLanguage();
    useEffect(() => {
        onValue(ctx);
        return undefined; // IMPORTANT: ne rien retourner (pas d'objet)
    }, [ctx, onValue]);
    return null;
}

describe("context/LanguageContext", () => {
    test("t() translates and replaces params + font switching", async () => {
        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <LanguageProvider>
                    <Consumer onValue={(v) => { latest = v; }} />
                </LanguageProvider>
            );
        });

        expect(latest.language).toBe("fr");
        expect(latest.t("hello", { name: "Amine" })).toBe("Bonjour Amine");

        await act(async () => {
            latest.setLanguage("en");
        });

        expect(latest.t("hello", { name: "Amine" })).toBe("Hello Amine");

        await act(async () => {
            latest.setFontType("opendyslexic");
        });

        expect(latest.fontFamily).toBe("OpenDyslexic");
        expect(latest.fontFamilyBold).toBe("OpenDyslexic-Bold");
    });

    test("getFontSize changes with textSize", async () => {
        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <LanguageProvider>
                    <Consumer onValue={(v) => { latest = v; }} />
                </LanguageProvider>
            );
        });

        const base = 10;
        const s1 = latest.getFontSize(base);

        await act(async () => {
            latest.setTextSize(5);
        });

        const s2 = latest.getFontSize(base);
        expect(s2).toBeGreaterThan(s1);
    });
});
