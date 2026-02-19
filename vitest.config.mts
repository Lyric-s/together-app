import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";
import path from "node:path";

export default defineConfig({
    plugins: [codspeedPlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
    test: {
        include: ["benchmarks/**/*.bench.ts"],
    },
});
