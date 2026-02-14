module.exports = {
    preset: "jest-expo",
    testMatch: ["**/__tests__/**/*.test.ts?(x)"],
    collectCoverage: true,
    collectCoverageFrom: [
        "utils/**/*.{ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "json"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
