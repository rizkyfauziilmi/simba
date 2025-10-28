# Code Style Guide for SIMBA

This document outlines the code style guidelines for the SIMBA project to ensure consistency and maintainability across the codebase.

## Table of Contents

1. [Introduction](#introduction)
2. [Formatting Tools](#formatting-tools)
3. [Prettier Configuration](#prettier-configuration)
4. [ESLint Configuration](#eslint-configuration)
5. [Git Pre-commit Hooks](#git-pre-commit-hooks)
6. [Formatting Commands](#formatting-commands)
7. [Editor Integration](#editor-integration)
8. [Best Practices](#best-practices)

## Introduction

SIMBA uses a combination of Prettier and ESLint to enforce consistent code formatting and best practices. These tools are configured to work together to provide a seamless development experience.

## Formatting Tools

- **Prettier**: Handles code formatting (spacing, line length, quotes, etc.)
- **ESLint**: Handles code quality rules and patterns
- **lint-staged**: Runs linters on pre-committed files
- **Husky**: Manages Git hooks to run lint-staged before commits

## Prettier Configuration

The Prettier configuration is defined in `.prettierrc.json` with the following settings:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "plugins": []
}
```

- `semi: false` - No semicolons
- `singleQuote: true` - Use single quotes instead of double quotes
- `tabWidth: 2` - Use 2 spaces for indentation
- `trailingComma: "es5"` - Add trailing commas where valid in ES5
- `printWidth: 100` - Wrap code at 100 characters
- `arrowParens: "avoid"` - Omit parentheses around a sole arrow function parameter when possible
- `bracketSpacing: true` - Print spaces between brackets in object literals
- `endOfLine: "lf"` - Line endings use LF (Unix-style)

### Ignored Files

The `.prettierignore` file specifies which files should be excluded from formatting:

- `node_modules/`
- `.next/`
- `prisma/`
- Build outputs, cache files, and more

## ESLint Configuration

ESLint is configured to work with Prettier and Next.js rules. The configuration is in `eslint.config.mjs` and includes:

- Next.js recommended rules
- TypeScript support
- Integration with Prettier to avoid conflicts

## Git Pre-commit Hooks

SIMBA uses Husky to run lint-staged before each commit. This ensures that all committed code follows our style guidelines.

The pre-commit hook automatically formats staged files using Prettier, preventing unformatted code from being committed.

## Formatting Commands

Several npm scripts are available for formatting and linting:

- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are correctly formatted without changing them
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run lint-format` - Run both ESLint and Prettier in sequence

## Editor Integration

### VS Code

For VS Code users, we recommend installing the following extensions:

1. **Prettier - Code formatter**
2. **ESLint**

Configure VS Code to format on save:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### JetBrains IDEs (WebStorm, IntelliJ IDEA)

1. Install the Prettier plugin
2. Configure Prettier as the default formatter
3. Enable "Run on save" in the Prettier configuration

## Best Practices

1. **Don't Bypass the Hook**: Avoid using `--no-verify` with Git commits unless absolutely necessary
2. **Fix Linting Errors**: Don't ignore ESLint errors; they often highlight potential bugs
3. **Format Before PR**: Always ensure your code is formatted before creating a pull request
4. **Editor Integration**: Configure your editor for the best experience with real-time feedback
5. **Keep Configuration Updated**: If you change Prettier or ESLint rules, communicate with the team

---

For questions or suggestions about this code style guide, please contact the project maintainers.
