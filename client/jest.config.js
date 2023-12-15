module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^@mui/x-charts/(?!(.*\\.(js|jsx)))":
      "<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!@mui/x-charts/PieChart), '/@mui/x-charts/PieChart/'",
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/cssMock.js",
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
