# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A recreation of classic Windows Minesweeper whose purpose is **learning React**. The stack is deliberately small: React 19 + TypeScript + Vite, Vitest, Tailwind v4 + CSS Modules, shadcn/ui, and React built-ins for state (no Redux/Zustand, no Next.js). See `docs/`:

- `docs/01-rules.md`: the game spec (difficulties, cell states, controls, chording, header, win/loss). Treat it as the source of truth for behavior.
- `docs/02-tech-stack.md`: stack choices and intended project layout (some listed files, like `Header.tsx`, `useTimer.ts`, `DifficultyMenu.tsx`, don't exist yet).
- `docs/03-react-concepts.md`: React concepts mapped to build phases 1–6. Work proceeds phase by phase; commits are titled `Phase N: ...`.

## Commands

```
npm run dev            # Vite dev server
npm test               # Vitest, run once
npm run test:watch
npx vitest run src/game/board.test.ts   # single file
npx vitest run -t "places mines"        # single test by name
npm run lint           # oxlint (.oxlintrc.json; rules-of-hooks is an error)
npm run build          # tsc -b && vite build (type check happens here)
```

There is no separate Vitest config; it uses `vite.config.ts`. React Testing Library is not installed yet, so current tests are pure-logic only.

## Architecture

**Key rule: `src/game/` must not import React.** Game rules are pure TypeScript functions, unit-tested directly; the UI is a thin layer on top.

- `src/game/board.ts`: board creation, `neighbors`, `placeMines` (keeps the first-clicked cell and its neighbors safe; takes an injectable `rng`).
- `src/game/actions.ts`: `reveal` (iterative flood fill), `toggleFlag`, `chord`, plus `isWon` / `isLost` / `getStatus` / `countFlags`. All return new boards (clone, never mutate), returning the *same* board reference when nothing changes.
- `src/game/reducer.ts`: `gameReducer` over `GameState { difficulty, board, started, seed }`. Mines are placed lazily on the first `REVEAL`. The reducer must stay pure (StrictMode double-invokes it): randomness comes from `seed` via the `mulberry32` PRNG, and new seeds are generated *outside* the reducer in `useGame` (lazy initializer and `reset`). Won/lost boards are frozen until `RESET`.
- `src/hooks/useGame.ts`: wraps `useReducer`, exposes `reveal/flag/chord/reset`, and computes `status` and `minesLeft` as **derived state**. Status is not stored in `GameState`; it is derived from the board plus `started`.
- `src/components/`: `Game` holds the state (lifted up) and passes it down to `Board` → `Cell`. `Board` decides click semantics (clicking a revealed cell chords, otherwise reveals); `Cell` handles right-click via `onContextMenu` + `preventDefault`.

Coordinates: `Position { x, y }` with boards indexed `board[y][x]` (row-major). Difficulties are `{ rows, cols, mines }` in `DIFFICULTIES`.

## Styling

- shadcn/ui components live in `src/components/ui` (copied in, editable); add more with `npx shadcn@latest add <name>`. They are for app chrome only, not the cells. Theme variables are in `src/index.css`.
- The board/cells use CSS Modules (`*.module.css`) for the retro bevel look.
- `@` aliases `src/` (vite.config.ts, tsconfig, components.json).

## Testing

Tests sit next to source as `*.test.ts`. Use `boardFromLayout` from `src/game/testUtils.ts` to build deterministic boards from text (`'*'` = mine), and pass a fixed seed to `createGame` for reproducible reducer tests.
