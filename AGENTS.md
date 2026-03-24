# AGENTS.md

## Purpose

- This repository contains an ioBroker adapter for Telekom Speedport routers.
- Runtime entry point is `main.js`.
- Router-specific clients live in `lib/w925v.js` and `lib/smart3.js`.
- Parsing and state-shaping logic lives in `lib/*.js` config/object files.
- Tests are Mocha-based and mostly live in `test/unit.js` plus package/integration harness files.

## Repository Rules Files

- No `.cursorrules` file exists.
- No `.cursor/rules/` directory exists.
- No `.github/copilot-instructions.md` file exists.
- There are therefore no extra Cursor or Copilot instructions beyond the repository source and config files.

## Environment Notes

- Node.js requirement in `package.json` is `>= 20`.
- CI runs on Node `20.x`, `22.x`, and `24.x` via `.github/workflows/test-and-release.yml`.
- Lint/check job uses Node `22.x` in CI.
- Adapter metadata and config schema live in `io-package.json`.
- Password is treated as protected/encrypted native config in `io-package.json`.

## Install And Setup

- Install dependencies with `npm ci`.
- If `npm ci` is unavailable, use `npm install`.

## Build, Lint, And Test Commands

- `npm run lint`
  - Runs ESLint with `eslint.config.mjs`.
- `npm run check`
  - Runs TypeScript checking for JS and `.d.ts` files via `tsconfig.check.json`.
  - Current status: this command fails in the checked-in state because the repo lacks a root `tsconfig.json` that `tsconfig.check.json` extends.
- `npm test`
  - Runs `npm run test:js && npm run test:package`.
  - Current status: this passes, but `test:js` does not execute `test/unit.js` because its glob only matches `*.test.js`-style files.
- `npm run test:js`
  - Runs Mocha for `*.test.js` patterns using `test/mocharc.custom.json`.
- `npm run test:package`
  - Validates `package.json`, `io-package.json`, admin JSON, README, and license files.
- `npm run test:unit`
  - Runs the real unit suite in `test/unit.js` with `TZ=Europe/Berlin`.
- `npm run test:integration`
  - Runs ioBroker integration tests via `test/integration.js`.
- `npm run dev-server`
  - Starts the ioBroker dev server.
- `npm run release`
  - Runs the release script.

## Single-Test Commands

- Prefer `npm run test:unit` for unit coverage in this repo.
- Run the whole unit file:
  - `npm run test:unit`
- Run a single unit test by title:
  - `npm run test:unit -- --grep "hashPassword\(\) should return hash"`
- Run a focused group of tests by suite or substring:
  - `npm run test:unit -- --grep "Smart3"`
  - `npm run test:unit -- --grep "EngineerMenu"`
- Run package tests only:
  - `npm run test:package`
- Run integration tests only:
  - `npm run test:integration`
- If you add `*.test.js` files, run them with:
  - `npm run test:js`
- Do not rely on `npm test` to cover `test/unit.js` until the script/glob is fixed.

## Files Agents Should Read First

- `package.json` for scripts and toolchain.
- `eslint.config.mjs` and `prettier.config.mjs` for formatting/lint expectations.
- `main.js` for adapter lifecycle and error handling patterns.
- `lib/smart3.js`, `lib/w925v.js`, and `lib/engineer_menu.js` for client structure.
- `lib/sputils.js` for shared parsing and validation helpers.
- `test/unit.js` for expected behavior and mock patterns.
- `io-package.json` for adapter IDs, native config, and instance object expectations.

## Code Style Guidelines

## Module System And Imports

- Use CommonJS modules in runtime code: `require(...)` and `module.exports`.
- Keep external imports first, then local imports.
- Use one `const` per import unless the file already uses a grouped declaration pattern.
- Destructure named imports when the module already exports structured members, for example `const { wrapper } = require("axios-cookiejar-support");`.
- Prefer relative local imports like `require("./sputils")` or `require("../lib/smart3_objects")`.
- Keep import ordering stable instead of aggressively re-sorting unrelated lines.

## Formatting

- Follow Prettier as configured in `prettier.config.mjs`.
- Use double quotes, not single quotes.
- Use semicolons.
- Use 4-space indentation.
- Keep trailing commas in multiline object/array/function-call literals when Prettier adds them.
- Prefer one statement per line.
- Keep long promise chains vertically aligned for readability.
- Preserve existing whitespace style in touched files.

## Types And JSDoc

- The codebase is primarily JavaScript, not TypeScript.
- Type checking is still intended via `tsc --noEmit` on JS files and `.d.ts` files.
- Add JSDoc when it clarifies public adapter-facing APIs or constructor/options shapes.
- `main.js` already uses JSDoc for adapter options; follow that pattern for externally meaningful APIs.
- Keep `lib/adapter-config.d.ts` aligned with `io-package.json` native config.
- Use `@ts-expect-error` only when there is a real ecosystem typing gap and add a short reason, as done for axios cookie jar integration.

## Naming Conventions

- Use `PascalCase` for classes and config factory exports such as `Smart3`, `W925V`, `EngineerMenu`, `DeviceListConfig`.
- Use `camelCase` for functions, methods, local variables, and instance fields.
- Use lower-camel names for module-level constants when the file already does so, e.g. `loginUrl`.
- Keep ioBroker state IDs consistent with the existing dotted naming scheme such as `info.connection`, `WAN.uptime`, `DSL.link_status`, and `clients.<mac>.ip`.
- Preserve existing domain vocabulary from router payloads where practical.

## Control Flow And Async Style

- Match the surrounding file style.
- Existing code uses both `async/await` and explicit promise chains.
- In files like `main.js`, promise chains are common for lifecycle/update flows.
- In tests and smaller helpers, `async/await` is also acceptable.
- Avoid mixing styles within a tiny block unless it makes the code clearer.
- Return promises directly from helper methods that are already promise-based.

## Error Handling

- Throw `Error` objects with specific messages when validation fails.
- Reuse helper checks like `sputils.checkStatus(...)` and `sputils.checkLoginStatus(...)` instead of duplicating logic.
- Preserve adapter behavior of logging `error.message` and `error.stack` where available.
- When adapter connectivity fails, route failures through `connectionHandler(false)` rather than silently ignoring them.
- Do not swallow exceptions unless shutdown/cleanup logic truly requires it.
- If you must fall back after a parse/decrypt failure, keep the fallback explicit and narrow.

## State And Data Modeling

- Router payloads are converted into arrays of config/state objects.
- Reuse `ConfigObject` from `lib/config.js` for new states.
- Keep `common.read = true` and `common.write = false` unless there is a real writable-state requirement.
- Use the existing `dynamic` flag semantics: dynamic states may be re-created on refresh.
- Keep parser functions small and close to the config they support.
- Preserve units, roles, and state IDs carefully; they are part of the adapter contract.

## Logging

- Use the adapter logger when available: `this.log.debug(...)`, `this.log.info(...)`, `this.log.error(...)`.
- In isolated helper/test contexts without a logger, `console.log(...)` is already used; do not introduce noisy logging in production paths unless it matches existing debug behavior.
- Avoid logging secrets such as adapter passwords or unhashed credentials.

## Testing Conventions

- Test framework is Mocha with Chai.
- Shared Mocha setup lives in `test/mocha.setup.js`.
- Unit tests use `axios-mock-adapter` and fixture files under `test/`.
- Keep timezone-sensitive tests under `TZ=Europe/Berlin`; the unit test script already does this.
- Prefer adding tests to `test/unit.js` unless you are intentionally creating new `*.test.js` coverage.
- Use descriptive `it("...")` titles that read like behavior statements.
- When asserting parsed state arrays, follow the existing `contains.something.like(...)` style.

## Lint Scope And Caveats

- ESLint ignores `*.test.js` and `test/**/*.js` in this repo.
- ESLint also ignores generated/admin typing files and build output.
- Even though tests are lint-ignored, keep new tests readable and consistent with the rest of the codebase.
- Because `npm run check` is currently broken by repository config, do not assume a type-check failure is caused by your change.

## Change Guidance For Agents

- Prefer minimal, targeted edits.
- Preserve CommonJS and existing architectural patterns unless the task explicitly requires modernization.
- When touching router parsing logic, verify behavior against fixtures in `test/`.
- When touching adapter lifecycle logic, re-run at least `npm run lint`, `npm run test:package`, and the relevant unit tests.
- If you modify test discovery or TypeScript config, call out the current script/config mismatch in your final notes.
