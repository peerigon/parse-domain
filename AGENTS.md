# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

**Important**: You **must** follow [these rules](./node_modules/@peerigon/configs/ai/rules.mdc) and its language-specific rules referenced in that file.

## Keeping This File Updated

When you make changes to the project that affect how AI agents should work with the codebase, update this file accordingly. This includes changes to:

- Overall folder structure
- Tech stack (frameworks, libraries, languages)
- npm scripts and development commands
- Testing approaches
- Build and deployment processes

**Important: Keep this file concise**. Only include information that is relevant for most or all development tasks. Omit specific implementation details that don't affect how agents interact with the codebase.

## Development Commands

This project uses npm scripts for all development tasks:

- **Test all**: `npm test` - Runs all tests in parallel (format, lint, types, unit)
- **Unit tests**: `npm run test:unit` - Run Vitest tests once
- **Watch tests**: `npm run vitest` - Run Vitest in watch mode
- **Lint**: `npm run test:lint` - ESLint with zero warnings allowed
- **Type check**: `npm run test:types` - TypeScript compiler check
- **Format check**: `npm run test:format` - Prettier format validation

**Important**: Use the typescript-lsp MCP (`getDiagnostics`, `getTypeAtPosition`, `getDefinition`, etc.) for type information
**Important**: Use the vitest-server MCP to run individual tests.
**Important**: Use the eslint MCP to check for linting errors.

## Project Structure

- **Source**: `src/` - All source code and tests
- **Tests**: Co-located with source files using `.test.ts` suffix
- **Configuration**: Uses `@peerigon/configs` for shared TypeScript, ESLint, and Prettier configs

## Code Organization

- Functions are implemented in individual files in `src/`
- Each function has comprehensive unit tests using Vitest
- Uses ES module syntax throughout (`.ts` extensions in imports)
- **Environment variables**: Use `src/env.ts`; destructure at top-level module scope so missing vars fail immediately.

## Template as a git remote

Configure the `template` remote so it can **only be fetched**, never pushed to:

```bash
git remote set-url --push template DISABLED
```

Verify with `git remote -v`: `template` should show a normal fetch URL and `DISABLED` (or empty) for push.

## Pulling Updates from Template

If the user is asking you to pull in updates from the template repository, follow the steps below.

### Step 1: Merge Template Updates

```bash
git fetch template
git merge --strategy-option theirs --no-commit template/main
```

This will:

- Prefer template files in conflicts (`--strategy-option theirs`)
- Stage changes without committing (`--no-commit`)

### Step 2: Restore Project Specific Files

Restore project-specific files and changes:

- **package.json**: Restore original dependencies but keep the dependency updates from the template repository
- **README.md**: Restore original project documentation
- **AGENTS.md**: Restore project specific instructions and include changes from the template repository
- **src/**: Restore project specific source code and include changes from the template repository
- If a file has been deleted in **this** repository, **do not** restore it from the template repository.

### Step 3: Verify and Clean Up

1. Run `npm install` to update lockfile
2. Run `npm test` to verify everything works
3. Review `git status` and `git diff --staged` for unexpected changes

### Step 4: Stage Changes

**IMPORTANT**: Stage your changes, but **do not commit**. Ask the user to review the changes first.
