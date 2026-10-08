# Minesweeper

A recreation of classic Windows Minesweeper, built to learn React. The stack is kept small on purpose: React 19, TypeScript, Vite, Vitest, Tailwind CSS v4 with CSS Modules, and shadcn/ui. State uses React's built-in hooks only.

## Getting started

Requires Node.js and npm.

```
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command              | What it does                                   |
|----------------------|------------------------------------------------|
| `npm run dev`        | Start the dev server with hot reload           |
| `npm test`           | Run the tests once                             |
| `npm run test:watch` | Run the tests in watch mode                    |
| `npm run lint`       | Lint with oxlint                               |
| `npm run build`      | Type-check and build for production (`dist/`)  |
| `npm run preview`    | Serve the production build locally             |

## How to play

- **Left click** a hidden cell to reveal it. The first click is always safe.
- **Right click** to place or remove a flag.
- **Left click a revealed number** to chord: if the right number of flags surround it, all its other neighbors are revealed.
- Reveal every safe cell to win. Reveal a mine and you lose.

The full rules are in [docs/01-rules.md](docs/01-rules.md).

## Status

The project is built in phases (see [docs/03-react-concepts.md](docs/03-react-concepts.md)). Phases 1–3 are done:

- [x] Static board
- [x] Game logic: mine placement, flood-fill reveal, flags, chording, win/loss detection
- [x] Interactivity: click, right-click, chord, mine counter, new game
- [ ] Game flow: timer, smiley face, header
- [ ] Windows features: difficulty levels and custom boards, `?` marks, best times
- [ ] Polish: component tests, accessibility, keyboard navigation

Only the Beginner board (9×9, 10 mines) is playable for now.

## Project structure

```
src/
  game/         Game rules as pure TypeScript (no React), with unit tests
  hooks/        useGame: wraps the reducer and computes derived state
  components/   Game, Board, Cell, plus shadcn/ui components in ui/
docs/           Rules, tech stack, and the React concepts each phase covers
```

The game logic lives in `src/game` and never imports React, so it can be tested on its own. The UI is a thin layer on top. [docs/02-tech-stack.md](docs/02-tech-stack.md) explains the stack choices.
