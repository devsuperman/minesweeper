import { chord, getStatus, reveal, toggleFlag } from './actions'
import { createEmptyBoard, placeMines } from './board'
import type { Board, Difficulty, Position } from './types'

export type GameState = {
  difficulty: Difficulty
  board: Board
  /** false until the first reveal; mines are only placed on that click */
  started: boolean
  /** seeds mine placement, so the reducer stays pure (no Math.random inside) */
  seed: number
}

export type GameAction =
  | { type: 'REVEAL'; pos: Position }
  | { type: 'FLAG'; pos: Position }
  | { type: 'CHORD'; pos: Position }
  | { type: 'RESET'; seed: number; difficulty?: Difficulty }

export function createGame(difficulty: Difficulty, seed: number): GameState {
  return { difficulty, board: createEmptyBoard(difficulty.rows, difficulty.cols), started: false, seed }
}

/** Small deterministic PRNG (mulberry32): same seed -> same sequence in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESET') {
    return createGame(action.difficulty ?? state.difficulty, action.seed)
  }

  // Once the game is won or lost the board is frozen until RESET.
  const status = getStatus(state.board, state.started)
  if (status === 'won' || status === 'lost') return state

  switch (action.type) {
    case 'REVEAL': {
      const { x, y } = action.pos
      if (state.board[y][x].state !== 'hidden') return state

      // First click: place the mines now so this cell (and its neighbors) is safe.
      const base = state.started
        ? state.board
        : placeMines(state.board, state.difficulty.mines, action.pos, mulberry32(state.seed))
      return { ...state, board: reveal(base, action.pos), started: true }
    }
    case 'FLAG':
      return { ...state, board: toggleFlag(state.board, action.pos) }
    case 'CHORD':
      return state.started ? { ...state, board: chord(state.board, action.pos) } : state
  }
}
