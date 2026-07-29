export default {
  "*": ["secretlint --no-glob"],
  "*.{js,jsx,ts,tsx,mts,cts,html,css,json,json5,md}": ["oxfmt --write"],
  "!(.github/workflows)/*.{yml,yaml}": ["oxfmt --write"],
  ".github/workflows/*.{yml,yaml}": ["pin-github-action --allow-empty", "oxfmt --write"],
};
