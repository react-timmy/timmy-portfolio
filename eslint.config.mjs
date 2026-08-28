import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    "**/.next/**",
    "**/dist/**",
    "**/node_modules/**",
    "devtimmy-portfolio/**",
    "app/**",
    "next-env.d.ts",
    "postcss.config.js",
    "tailwind.config.js",
  ]),
  {
    files: ["src/**/*.{js,jsx}", "server/**/*.js", "*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        React: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        fetch: "readonly",
        URL: "readonly",
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        TextDecoder: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["src/**/*.jsx"],
    rules: {
      "no-unused-vars": "off",
    },
  },
]);

export default eslintConfig;
