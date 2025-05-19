import type { Config } from "jest";

const baseConfig: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  rootDir: "./",
  testEnvironment: "node",
};

const e2eConfig: Config = {
  ...baseConfig,
  testRegex: ".e2e-test.ts$",
};

const unitTestConfig: Config = {
  ...baseConfig,
  testRegex: ".*\\.test\\.ts$",
  testPathIgnorePatterns: ["./test/e2e"],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
};

const config: Config = {
  projects: [
    {
      displayName: "e2e",
      ...e2eConfig,
    },
    {
      displayName: "not-e2e",
      ...unitTestConfig,
    },
  ],
};

export default config;
