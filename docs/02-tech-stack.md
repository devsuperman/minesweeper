# Tech Stack

The goal of the project is to **learn React**, so the stack is kept small and mainstream. Everything below can be changed, but these are the defaults.

| Concern          | Choice                          | Why |
|------------------|---------------------------------|-----|
| UI library       | **React 19**                    | The thing we are learning. |
| Language         | **TypeScript**                  | Makes the board/cell data shapes explicit and catches mistakes early. |
| Build tool / dev server | **Vite**                 | Fast start, hot reload, minimal config. `create-react-app` is deprecated. |
| Testing          | **Vitest** + **React Testing Library** | Vitest shares Vite's config; RTL tests components the way users use them. |
| Styling          | **CSS Modules** (plain CSS)     | Scoped class names with no extra library; ideal for the retro bevel look. |
| State management | **React built-ins** (`useReducer`, `useContext`) | No Redux/Zustand: the state is small and learning the built-ins is the point. |
| Linting/format   | **ESLint** (with `react-hooks` plugin) + **Prettier** | The hooks lint rules teach the rules of hooks. |
| Package manager  | **npm**                         | Default, no extra install. |
| Deployment       | **GitHub Pages** (or Vercel)    | Static site, free. |

## Not used (on purpose)

- **Next.js / Remix**: no server, routing or SSR is needed.
- **Redux / Zustand**: overkill for one reducer.
- **Tailwind / UI kits**: the Windows look is custom CSS anyway.
- **Canvas / game engines**: we want the DOM and React's rendering model.

## Project layout

```
src/
  game/            # pure TypeScript, no React imports
    types.ts       # Cell, Board, GameStatus, Difficulty
    board.ts       # createBoard, placeMines, countAdjacent
    actions.ts     # reveal (flood fill), toggleFlag, chord, checkWin
    *.test.ts
  components/
    Game.tsx
    Board.tsx
    Cell.tsx
    Header.tsx
    DifficultyMenu.tsx
  hooks/
    useGame.ts     # useReducer wrapper
    useTimer.ts
  App.tsx
  main.tsx
docs/
```

**Key rule:** `src/game` must not import React. The rules are plain functions, easy to unit test, and the UI is a thin layer on top.

## Commands (once scaffolded)

```
npm install
npm run dev        # dev server
npm test           # Vitest
npm run lint
npm run build      # production build
npm run preview    # serve the build
```
