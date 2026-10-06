export type CellState = 'hidden' | 'revealed' | 'flagged'

export type CellData = {
  mine: boolean
  adjacent: number
  state: CellState
}

export type Board = CellData[][]

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type Difficulty = { rows: number; cols: number; mines: number }

export const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
} as const satisfies Record<string, Difficulty>

export type Position = { x: number; y: number }
