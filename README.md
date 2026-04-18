# template

**🚀 Boilerplate template to kick start new projects at Peerigon**

## Getting Started

### Option A: From a blank slate

#### Step 1:

Fork this repository. This way the new repository will reference this repository as `upstream` and you will be able to easily pull in updates from this repository.

#### Step 2:

Prompt your AI coding assistant to customize the template project files:

<details>

````markdown
# Customize Template Project Files

## Information Gathering

First, prompt the user for the following information:

1. **Project name** (e.g., `my-awesome-project` or `@scope/package-name`)
2. **Project description** (one-line summary of what the project does)
3. **Keywords** (array of relevant keywords for package.json, can be empty)
4. **Author/Organization** (e.g., `Peerigon`, `John Doe <john@example.com>`, or email)
5. **License type** (e.g., `MIT`, `Apache-2.0`, `ISC`, `Unlicensed`, or `PROPRIETARY`)
6. **Copyright holder** (name for LICENSE file, defaults to author/organization)

## Files to Update

### 1. package.json

Update the following fields:

- `name`: Replace `@peerigon/template` with the new project name
- `version`: Consider resetting to `0.1.0` or `1.0.0` depending on project stage
- `description`: Replace template description with actual project description
- `keywords`: Update with relevant project keywords
- `license`: Update license identifier (e.g., `MIT`, `Apache-2.0`, `UNLICENSED`)
- `author`: Update with the actual author/organization

### 2. README.md

- Replace title with actual project name
- Remove the emoji rocket and template description
- Remove the "Getting Started" section about forking the template
- Add project-specific description and usage instructions
- Consider adding sections: Installation, Usage, Development, Contributing

### 3. LICENSE

- Update copyright year to current year (2025)
- Update copyright holder name
- If license type is not MIT, replace entire file contents with appropriate license text
- If `UNLICENSED` or `PROPRIETARY`, either remove the file or replace with appropriate notice

### 4. AGENTS.md

- Note: `CLAUDE.md` is a symbolic link to `AGENTS.md`, so only `AGENTS.md` needs to be updated
- Update "Project Structure" section if the actual project structure differs
- Update "Code Organization" section with project-specific patterns
- Keep the development commands and MCP tool instructions as-is
- Keep the "Upstream remote" and "Pulling Updates from Upstream" sections as-is (they prevent accidental pushes to the public template)

### 5. Example Source Files

The `src/` directory contains example files (`add.ts`, `add.test.ts`, `main.ts`):

- Keep them as reference examples per user preference
- Note to user: these can be deleted once actual project code is implemented
- They serve as examples of the testing and code organization patterns

## Git remotes (do this before other Git work)

If the repo has an `upstream` remote for `peerigon/template`, ensure pushes to it are disabled so only `git fetch`/`git merge` from upstream are possible:

```bash
git remote set-url --push upstream DISABLED
```
````

If `upstream` is missing, run `git remote add upstream https://github.com/peerigon/template.git`, then `git remote set-url --push upstream DISABLED`. Confirm with `git remote -v`.

## Additional Considerations

- Check if `package-lock.json` should be regenerated after package.json changes
- Verify all tests still pass after changes: `npm test`

`````

</details>

### Option B: With an already existing repository

#### Step 1:

Prompt your AI coding assistant to merge the template repository into your repository:

<details>

````markdown
# Merge Template into Existing Project

## Phase 1: Pre-Merge Information Gathering

Before starting the merge, collect information about the existing project:

1. Read current `package.json` to extract:
   - Project name
   - Description
   - Keywords
   - Author/Organization
   - License
   - Current version

2. Check for existing `LICENSE` file and note copyright holder

3. Review existing source structure in `src/` directory

## Phase 2: Execute Git Merge

Add the template as `upstream` and **disable pushes** to it (so you never send your project’s commits to the public template). If `upstream` already exists, only run the `set-url --push` line.

```bash
git remote add upstream https://github.com/peerigon/template.git
git remote set-url --push upstream DISABLED
git fetch upstream
git merge --allow-unrelated-histories --strategy-option theirs --no-commit upstream/main
`````

This will:

- Allow merging unrelated histories
- Prefer template files in conflicts (`--strategy-option theirs`)
- Stage changes without committing (`--no-commit`)

## Phase 3: Restore Project Identity

After merge, restore project-specific metadata:

### package.json

- Restore original `name`, `description`, `keywords`, `author`, `license`, `version`
- Keep template's updated dependencies and scripts
- Merge any custom scripts from original project

### LICENSE

- Restore original copyright holder and year
- Keep original license type if different from MIT

### README.md

- Restore the original README.md
- Add new commands from the `package.json` that haven't been mentioned yet

### AGENTS.md

- Update with project-specific structure and patterns
- Keep template's MCP tool instructions

## Phase 4: Handle Source Files

Decide on treatment of `src/` directory:

- Remove template example files (`add.ts`, `add.test.ts`) if project has real source
- Keep template examples only if project is just starting

## Phase 5: Verify and Clean Up

1. Run `npm install` to update lockfile
2. Run `npm test` to verify all changes work
3. Review `git status` and `git diff --staged` for any unexpected changes
4. Clean up any unwanted template artifacts
5. Confirm `git remote -v` shows `upstream` with push URL `DISABLED` (if you skipped it in Phase 2, run `git remote set-url --push upstream DISABLED`)

## Phase 6: Staging

**IMPORTANT**: Stage your changes, but **do not** commit any changes. Ask the user to review the changes.

````

</details>

## GitHub rulesets (blueprints)

The JSON files under [`.github/rulesets/`](./.github/rulesets/) are **blueprints** for GitHub rulesets. GitHub does not apply them from the repository; import or recreate them in your repo’s (or organization’s) ruleset settings. See [`.github/rulesets/README.md`](./.github/rulesets/README.md) for details.

## How to pull in updates from the upstream repository

Ask your AI coding assistant:

```prompt
Merge the "upstream" remote into the current branch as described in the AGENTS.md file.
```
````
