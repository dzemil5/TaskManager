module.exports = {
  setupFiles: ["./jest.setup.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
};
