import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    env: {
      node: true,
      jest: true,
    },
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "indent": ["error", 2],
      "max-len": [
        "error",
        {
          "code":120,
        }
      ]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
