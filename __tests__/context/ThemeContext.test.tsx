/* eslint-disable @typescript-eslint/no-deprecated */
import React, { useEffect } from "react";
import TestRenderer, { act } from "react-test-renderer";

jest.mock("expo-status-bar", () => ({
    StatusBar: () => null,
}));

import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function Consumer({ onValue }: { onValue: (v: any) => void }) {
    const ctx = useTheme();
    useEffect(() => {
        onValue(ctx);
        return undefined;
    }, [ctx, onValue]);
    return null;
}

describe("context/ThemeContext", () => {
    test("toggleTheme flips dark mode and colors", async () => {
        let latest: any = null;

        await act(async () => {
            TestRenderer.create(
                <ThemeProvider>
                    <Consumer onValue={(v) => { latest = v; }} />
                </ThemeProvider>
            );
        });

        expect(latest.isDarkMode).toBe(false);
        const lightBg = latest.colors.background;

        await act(async () => {
            latest.toggleTheme();
        });

        expect(latest.isDarkMode).toBe(true);
        expect(latest.colors.background).not.toBe(lightBg);
    });
});
