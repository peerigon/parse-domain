import { typescriptNodePreset } from "@peerigon/configs/eslint/presets/typescript-node";
import { noDefaultExport } from "@peerigon/configs/eslint/styles/no-default-export";
import { noNull } from "@peerigon/configs/eslint/styles/no-null";

export default [
  ...typescriptNodePreset,
  ...noNull,
  ...noDefaultExport,
  {
    ignores: ["build/**", "serialized-tries/**"],
  },
];
