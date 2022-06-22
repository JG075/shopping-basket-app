const nextJest = require("next/jest")

const createJestConfig = nextJest()

module.exports = createJestConfig({
    moduleDirectories: ["node_modules", "<rootDir>/src/__tests__"],
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["./jest.setup.ts"],
})
