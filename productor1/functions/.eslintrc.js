// BACKEND ESLINT CONFIG: This file configures ESLint for linting TypeScript and JavaScript in the Firebase Functions backend.
// It enforces code quality, style, and best practices for backend code.
//
// Design Patterns: Uses the Linter/Static Analysis pattern for code quality.
// Data Structures: Uses JavaScript objects for configuration.
// Security: Helps catch bugs and potential vulnerabilities early in development.

module.exports = {
  root: true, // Treat this as the root ESLint config.
  env: {
    es6: true, // Enable ES6 features.
    node: true, // Enable Node.js global variables and scoping.
  },
  extends: [
    "eslint:recommended", // Use recommended ESLint rules.
    "plugin:import/errors", // Import plugin for error checking.
    "plugin:import/warnings", // Import plugin for warning checking.
    "plugin:import/typescript", // Import plugin for TypeScript support.
    "google", // Google JavaScript style guide.
    "plugin:@typescript-eslint/recommended", // Recommended TypeScript rules.
  ],
  parser: "@typescript-eslint/parser", // Use TypeScript parser for ESLint.
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"], // Specify TypeScript config files.
    sourceType: "module", // Use ES module syntax.
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint", // TypeScript plugin for ESLint.
    "import", // Import/export plugin.
  ],
  rules: {
    "quotes": ["error", "double"], // Enforce double quotes.
    "import/no-unresolved": 0, // Disable unresolved import errors (handled by TypeScript).
    "indent": ["error", 2], // Enforce 2-space indentation.
  },
};
