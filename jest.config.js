module.exports = {
    preset: "jest-expo",
    testMatch: ["**/__tests__/**/*.test.ts?(x)"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "json"],

    collectCoverageFrom: [
        "utils/**/*.{ts,tsx}",
        "services/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "context/**/*.{ts,tsx}",

        "!**/*.d.ts",
        "!**/node_modules/**",
        "!**/assets/**",
        "!**/constants/**",
        "!**/types/**",
        "!**/*index.{ts,tsx}",
    ],
};
