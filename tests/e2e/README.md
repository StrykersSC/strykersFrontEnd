Playwright E2E scaffolding

How to run:

1. Install Playwright (run from project root):

```powershell
npm install -D @playwright/test
npx playwright install --with-deps
```

2. Start dev server (in another terminal):

```powershell
npm run dev
```

3. Run tests:

```powershell
npm run test:e2e
```

Notes:
- The scaffolded test `example.spec.cjs` writes a `strykers_membros` entry directly into `localStorage` before loading the app and checks for the member in the UI or falls back to asserting storage.
- Adjust selectors in `example.spec.cjs` to match your app's DOM if necessary.
