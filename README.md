# Mindframe OS

## Development Setup

### Linting

Run ESLint (with Prettier and all strict rules) across the codebase:

```bash
npm run lint
```

To auto-fix lint errors:

```bash
npm run lint:fix
```

### Formatting

Run Prettier (checks formatting):

```bash
npm run format
```

Auto-format all files:

```bash
npm run format:write
```

### Testing

Run all tests (Vitest):

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Pre-commit Hooks

For best DX, enable pre-commit linting/formatting using [lint-staged](https://github.com/okonet/lint-staged):

```bash
npx husky-init && npm install && npx husky set .husky/pre-commit "npx lint-staged"
```

This ensures all staged files are linted and formatted before each commit.

---

All major code and configuration files use maximal error catching, verbose logging, strict linting, and comprehensive automated tests for reliability and maintainability.

