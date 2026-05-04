export default {
  "*": ["secretlint --no-glob"],
  "*.{js,jsx,ts,tsx,html,css,json,json5,md}": ["prettier --write"],
  "!(.github/workflows)/*.{yml,yaml}": ["prettier --write"],
  ".github/workflows/*.{yml,yaml}": [
    "pin-github-action --allow-empty",
    "prettier --write",
  ],
};
