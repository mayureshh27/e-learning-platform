/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
    testPathIgnorePatterns: ['<rootDir>/src/__tests__/setup.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/server.ts',
        '!src/seed.ts',
        '!src/__tests__/**',
    ],
    coverageDirectory: 'coverage',
    globalSetup: '<rootDir>/src/__tests__/globalSetup.ts',
    globalTeardown: '<rootDir>/src/__tests__/globalTeardown.ts',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupAfterEnv.ts'],
    testTimeout: 30000,
};
