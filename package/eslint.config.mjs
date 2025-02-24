import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: "readonly" // Add React to global scope
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 2021,
        sourceType: "module"
      }
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Turn off the rule requiring React to be in scope
      "react/jsx-uses-react": "off", // Turn off the rule for React usage in JSX
      // "react/jsx-uses-vars": "on" // Prevent variables used in JSX from being marked as unused
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  ...tseslint.configs.recommended
];
