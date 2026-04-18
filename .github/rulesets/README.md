# Ruleset blueprints

The JSON files in this folder are **blueprints** for [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets-for-a-repository/about-rulesets). They are **not** applied automatically just because they live in the repository.

GitHub does **not** read ruleset definitions from files under `.github/rulesets/` (or anywhere else in the repo). Rulesets only take effect after you create or import them in **Repository settings → Rules → Rulesets** (or via organization rulesets and the API).

## How to use them

1. Open your repository (or organization) ruleset settings in GitHub.
2. Create a new ruleset and use **Import ruleset** (or equivalent), or copy the JSON and adjust it to match your branches, required checks, and policies.
3. Review and enable the ruleset for the refs you care about.

Treat the files here as a starting point: rename branches, tweak bypass lists, and align required status checks with your actual CI before enabling enforcement.
