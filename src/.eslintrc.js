const path = require("path");

module.exports = {
  extends: [
    "peerigon/presets/prettier-typescript.js",
    // See https://github.com/peerigon/eslint-config-peerigon#peerigonstylesno-default-export
    "peerigon/styles/no-default-export",
    "peerigon/styles/no-null",
  ],
  env: {
    node: true,
  },
  root: true,
  parserOptions: {
    tsconfigRootDir: path.resolve(__dirname, ".."),
    project: "./tsconfig.json",
    sourceType: "module",
  },
};