import typescriptPreset from "@peerigon/configs/eslint/presets/typescript";
import vitestRules from "@peerigon/configs/eslint/rules/vitest";
import stylesNoDefaultExport from "@peerigon/configs/eslint/styles/no-default-export";
import { noNull } from "@peerigon/configs/eslint/styles/no-null";
import globals from "globals";

export default [
  { ignores: ["serialized-tries/"] },
  ...typescriptPreset,
  ...vitestRules,
  ...stylesNoDefaultExport,
  ...noNull,
  {
    files: ["bin/**"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.test.ts"],
    rules: {
      "vitest/expect-expect": [
        "error",
        {
          assertFunctionNames: [
            "expect",
            "expectRoot",
            "expectChild",
            "expectNode",
          ],
        },
      ],
    },
  },
];
