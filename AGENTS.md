# AGENTS.md

## What this is

Single Next.js 16.4 app (App Router) — a course project ("Programming Hero" Module 39) meant to demonstrate Better Auth social login. Not a monorepo. JavaScript only (no TypeScript, no `tsconfig.json`).

- App entrypoints: `src/app/layout.js`, `src/app/page.js`, `src/app/globals.css`
- Path alias: `@/*` → `./src/*` (defined in `jsconfig.json`)
- The demo/starter content has been stripped: `README.md` is blank, `src/app/page.js` renders nothing. Expected — don't "restore" the create-next-app boilerplate.
- Despite the name `nextjs-better-auth-social`, Better Auth is **not installed yet** (only `next`, `react`, `react-dom`). Auth code/deps are future work.

## Commands

```bash
npm run dev     # Next dev (Turbopack is the default bundler in Next 16)
npm run build   # production build — this is the reliable verification step
npm run start
npm run lint    # BROKEN, see below
```

There are no tests, no typecheck script, and no CI workflows.

### Known issue: `npm run lint` crashes

`eslint-config-next` 16 pulls in `typescript-eslint`, which hard-requires the `typescript` package — but `typescript` is not in `devDependencies`. So `npm run lint` (and any `npx eslint <file>`) exits 2 with `Error: Cannot find module 'typescript'`, before linting anything.

- Don't interpret this as a lint error in your code.
- To make lint work: `npm install -D typescript` (then `npm run lint`).
- In the meantime, verify with `npm run build` — it compiles, runs its TypeScript pass, and prerenders pages.

## Toolchain quirks

- **Tailwind v4, no config files.** There is no `tailwind.config.*` and no `postcss.config.*`. Tailwind is wired via the `@tailwindcss/turbopack` loader rule in `next.config.mjs`, and `src/app/globals.css` is just `@import "tailwindcss";`. Do not add a PostCSS config or use Tailwind v3 directives (`@tailwind base/components/utilities`) — that breaks the Turbopack setup.
- **React Compiler is on.** `next.config.mjs` sets `reactCompiler: true` (with `babel-plugin-react-compiler`). Component code must satisfy React Compiler rules (no mutating props, etc.) or the build can fail.
- **ESLint config** is flat config at `eslint.config.mjs` using `eslint-config-next/core-web-vitals`; it ignores `.next/`, `out/`, `build/`, `next-env.d.ts`.
- Env files are fully gitignored (`.env*`). None are committed; the app currently needs no env vars.

## Before finishing a task

Run `npm run build` (and `npm run lint` only if `typescript` has been installed). There is no test suite to run.
