// jest.config.js
module.exports = {
    preset: "jest-expo",
    testMatch: ["**/__tests__/**/*.test.ts?(x)"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "text-summary", "lcov", "json-summary"],

    collectCoverageFrom: [
        "utils/**/*.{ts,tsx}",
        "services/**/*.{ts,tsx}",
        "context/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",

        // Exclusions générales
        "!**/*.d.ts",
        "!**/node_modules/**",
        "!**/assets/**",
        "!**/styles/**",
        "!**/constants/**",
        "!**/types/**",
        "!**/*index.{ts,tsx}",

        // EXCLU l'UI
        "!components/**/*.{ts,tsx}",
        "!app/**/*.{ts,tsx}",
        "!pages/**/*.{ts,tsx}",

        // Ces fichiers sont très "infra" (interceptors axios) → coûteux à tester
        "!services/api.ts",
        "!services/adminService.ts",
        "!services/associationService.ts",
        "!services/volunteerService.ts",
    ],

    // Gate 70%
    coverageThreshold: {
        global: {
            lines: 70,
            statements: 70,
            functions: 70,
            branches: 50,
        },
    },
};
