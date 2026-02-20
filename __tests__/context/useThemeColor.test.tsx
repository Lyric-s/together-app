/* eslint-disable @typescript-eslint/no-deprecated */
import React from "react";
import TestRenderer, { act } from "react-test-renderer";

jest.mock("@/constants/theme", () => ({
    Colors: {
        light: { tint: "L_TINT" },
        dark: { tint: "D_TINT" },
    },
}));

jest.mock("@/hooks/use-color-scheme", () => ({
    useColorScheme: jest.fn(),
}));

import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";

function HookRunner(props: { light?: string; dark?: string; onValue: (v: any) => void }) {
    const v = useThemeColor({ light: props.light, dark: props.dark }, "tint" as any);
    props.onValue(v);
    return null;
}

describe("hooks/useThemeColor", () => {
    test("returns prop override for theme", () => {
        (useColorScheme as jest.Mock).mockReturnValue("dark");

        let value: any;
        act(() => {
            TestRenderer.create(<HookRunner dark="X" onValue={(v) => { value = v; }} />);
        });

        expect(value).toBe("X");
    });

    test("returns Colors[theme][colorName] when no override", () => {
        (useColorScheme as jest.Mock).mockReturnValue("light");

        let value: any;
        act(() => {
            TestRenderer.create(<HookRunner onValue={(v) => { value = v; }} />);
        });

        expect(value).toBe("L_TINT");
    });

    test("defaults to light when hook returns null", () => {
        (useColorScheme as jest.Mock).mockReturnValue(null);

        let value: any;
        act(() => {
            TestRenderer.create(<HookRunner onValue={(v) => { value = v; }} />);
        });

        expect(value).toBe("L_TINT");
    });
});
