# React Concepts and How They Are Used Here

Each concept lists what it is, where it appears in this project, and a short example. The order roughly follows the build phases.

---

## 1. Components

**What:** A function that returns UI. Components are the building blocks; names start with a capital letter.

**Here:** `Game` → `Header` + `Board` → many `Cell`s. Each piece has one job.

```tsx
function Cell({ cell }: { cell: CellData }) {
  return <button className={styles.cell}>{/* ... */}</button>;
}
```

## 2. JSX

**What:** HTML-like syntax inside JavaScript that compiles to function calls. `{}` embeds any JS expression.

**Here:** Rendering the number in a revealed cell, the smiley, the timer digits.

## 3. Props

**What:** Read-only inputs passed from parent to child. Data flows **down**.

**Here:** `Board` receives the board; each `Cell` receives its data and callbacks like `onReveal` and `onFlag`.

```tsx
<Cell cell={cell} onReveal={() => reveal(x, y)} />
```

## 4. Rendering lists and `key`

**What:** Use `map` to render arrays. Each item needs a stable `key` so React can match items between renders.

**Here:** Rows of cells in `Board`. Key by position (`${x}-${y}`), since the grid never reorders.

```tsx
{board.map((row, y) => (
  <div key={y} className={styles.row}>
    {row.map((cell, x) => <Cell key={x} cell={cell} />)}
  </div>
))}
```

## 5. Conditional rendering

**What:** Show different UI based on data, using `&&`, ternaries or early returns.

**Here:** A `Cell` shows nothing when hidden, 🚩 when flagged, 💣 for a mine, or its number when revealed. The smiley face changes by game status.

## 6. State: `useState`

**What:** Memory for a component. Changing state via its setter triggers a re-render. State is a **snapshot**: it does not change mid-render.

**Here:** First version of the board, the "mouse is pressed" flag (for 😮), and the selected difficulty.

## 7. Immutability

**What:** Never modify state in place; create a new object/array. React detects changes by reference.

**Here:** Revealing a cell returns a new board. Mutating `board[y][x].state = 'revealed'` will not re-render (and breaks StrictMode and memoization).

```ts
const next = board.map(row => row.map(cell => ({ ...cell })));
next[y][x].state = 'revealed';
```

## 8. Event handling

**What:** Handlers are passed as props such as `onClick` and `onContextMenu`. React wraps native events.

**Here:** Left click reveals; right click flags using `onContextMenu` with `e.preventDefault()` to suppress the browser menu; `onMouseDown`/`onMouseUp` drive the 😮 face.

## 9. `useReducer`

**What:** State managed by a pure function `(state, action) => newState`. Good when many kinds of updates touch related state.

**Here:** The whole game: board, status, flags used, start time. Actions: `REVEAL`, `FLAG`, `CHORD`, `RESET`, `SET_DIFFICULTY`.

```ts
function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'REVEAL': return reveal(state, action.x, action.y);
    case 'FLAG':   return toggleFlag(state, action.x, action.y);
    case 'RESET':  return createGame(action.difficulty);
  }
}
```

Reducers must be **pure**: no randomness or timers inside, or StrictMode's double invocation will expose the bug. Mine placement uses an injectable random function.

## 10. Derived state

**What:** If a value can be computed from existing state, compute it during render instead of storing it.

**Here:** The mine counter (`mines - flagCount`) and "has the player won?" are derived from the board, not stored separately.

## 11. `useEffect`

**What:** Run side effects (timers, subscriptions, storage) after render, synchronizing React with the outside world. Has a dependency array and an optional cleanup function.

**Here:** The timer ticks every second while status is `playing`; saving the best time to `localStorage` on win.

```tsx
useEffect(() => {
  if (status !== 'playing') return;
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id);   // cleanup
}, [status]);
```

Rule of thumb: effects are for syncing with external systems, not for computing data from state.

## 12. Custom hooks

**What:** Functions starting with `use` that bundle reusable stateful logic.

**Here:** `useTimer` (start/stop/reset) and `useGame` (wraps the reducer and exposes `reveal`, `flag`, `reset`). Components stay small.

## 13. Rules of hooks

**What:** Call hooks only at the top level of components/hooks, never inside loops, conditions or nested functions.

**Here:** Enforced by the `react-hooks` lint rules (oxlint ships these).

## 14. Lifting state up

**What:** When siblings need the same data, move the state to their closest common parent.

**Here:** `Header` (counter, timer, smiley) and `Board` both depend on game state, so it lives in `Game`.

## 15. Context: `useContext`

**What:** Pass data deep in the tree without prop drilling.

**Here (optional):** Provide difficulty/settings to the menu and game. Not needed for the board itself because it's only two levels deep; a good place to learn when context is *not* required.

## 16. Controlled inputs

**What:** Form fields whose value comes from state and updates via `onChange`.

**Here:** The Custom difficulty form (width, height, mines) with validation.

## 17. Refs: `useRef`

**What:** A mutable box that persists across renders without causing re-renders. Also used to access DOM nodes.

**Here:** Storing the interval id, or tracking whether the mouse is held down across cells.

## 18. Memoization: `React.memo`, `useMemo`, `useCallback`

**What:** Skip work when inputs are unchanged. `React.memo` skips re-rendering a component if props are shallow-equal; `useCallback` keeps a function reference stable so memo works.

**Here:** On Expert (480 cells) every click re-renders every `Cell`. Wrap `Cell` in `React.memo` and pass stable handlers. Because the reducer is immutable and unchanged cells keep their object identity, only the changed cells re-render. **Measure with React DevTools Profiler first.**

## 19. StrictMode

**What:** A dev-only wrapper that double-invokes renders, reducers and effects to expose impure code.

**Here:** On by default in `main.tsx`. If the first click places mines twice or the timer runs at double speed, something is impure or a cleanup is missing.

## 20. Testing components

**What:** Render a component, interact like a user, assert on what is visible.

**Here:** React Testing Library tests: clicking a cell reveals it, right-click shows a flag, losing shows 😵. The game logic itself is tested without React.

## 21. Accessibility

**What:** Semantic elements and ARIA attributes so the UI works with keyboards and screen readers.

**Here:** `role="grid"` on the board, `aria-label` on cells ("row 3, column 4, hidden"), keyboard navigation with arrow keys.

---

## Concept → phase map

| Phase | Concepts |
|-------|----------|
| 1. Static board       | 1, 2, 3, 4, 5 |
| 2. Game logic         | (no React; pure TypeScript and tests) |
| 3. Interactivity      | 6, 7, 8, 9 |
| 4. Game flow          | 10, 11, 12, 13, 14 |
| 5. Windows features   | 15, 16, 17, 18 |
| 6. Polish             | 19, 20, 21 |
