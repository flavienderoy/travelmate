{
  "name": "jest.config",
  "testEnvironment": "node",
  "testMatch": ["**/tests/**/*.test.js"],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/tests/**",
    "!src/config/**"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"]
}
