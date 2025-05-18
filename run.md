# How to Run Mindframe OS

This guide explains how to set up, develop, test, and run the Mindframe OS extension/app locally.

---

## 1. **Prerequisites**

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning, if not already cloned)

---

## 2. **Install Dependencies**

```bash
npm install
```

---

## 3. **Run in Development Mode**

This starts the Vite development server with hot reload for the extension popup/app UI.

```bash
npm run dev
```

- The development server will print a local URL (e.g., http://localhost:5173) for the popup/app UI.
- For extension background/service worker and content scripts, see "Load in Browser" below.

---

## 4. **Build for Production**

This will generate the extension/app build in the `dist/` directory.

```bash
npm run build
```

---

## 5. **Run Linting and Formatting Checks**

Strict linting and formatting are enforced.

```bash
npm run lint           # Check code style and catch errors
npm run lint:fix       # Auto-fix lint errors where possible
npm run format         # Check formatting
npm run format:write   # Auto-format files using Prettier
```

---

## 6. **Run Tests**

Runs all unit and component tests (with coverage if configured):

```bash
npm test           # One-off test run
npm run test:watch # Watch mode for active development
```

---

## 7. **Load Extension in Browser (for Local Testing)**

After building, load the extension into your browser:

1. Run `npm run build` to generate the production build.
2. Open your browser's Extensions/Manage Extensions page.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the `dist/` directory.
5. The Mindframe OS extension should now appear in your browser.
6. Open the popup or navigate to a web page to see the content script and insights in action.

---

## 8. **CI/CD**

All pushes and PRs are automatically linted, formatted, and tested via GitHub Actions (`.github/workflows/ci.yml`).

---

## 9. **Other Useful Scripts**

- `npm run lint:fix` — Auto-fix lint issues.
- `npm run format:write` — Auto-format using Prettier.

---

## 10. **Troubleshooting**

- If you see errors on build or serve, ensure your Node/npm versions are up to date.
- If extension UI fails to load, check the browser console for errors and verify all assets are present in `dist/`.
- Ensure environment variables (e.g., LLM proxy URL) are set correctly if required.

---

For further details, see `project.md` for project structure and module explanations.