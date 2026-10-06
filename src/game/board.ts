import type { Board, Position } from './types'

const OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
] as const

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, adjacent: 0, state: 'hidden' as const })),
  )
}

export function inBounds(board: Board, { x, y }: Position): boolean {
  return y >= 0 && y < board.length && x >= 0 && x < board[0].length
}

export function neighbors(board: Board, { x, y }: Position): Position[] {
  return OFFSETS.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter((p) => inBounds(board, p))
}

/**
 * Returns a new board with `mines` mines placed and adjacent counts computed.
 * The `safe` cell and its neighbors are kept mine-free so the first click opens
 * an area; if the board is too crowded for that, only the `safe` cell is protected.
 * `rng` is injectable (returns [0, 1)) so the function stays testable and pure.
 */
export function placeMines(
  board: Board,
  mines: number,
  safe: Position,
  rng: () => number = Math.random,
): Board {
  const rows = board.length
  const cols = board[0].length
  if (mines > rows * cols - 1) throw new Error('Too many mines for this board')

  const key = (p: Position) => p.y * cols + p.x
  let excluded = new Set([safe, ...neighbors(board, safe)].map(key))
  if (rows * cols - excluded.size < mines) excluded = new Set([key(safe)])

  const candidates: number[] = []
  for (let i = 0; i < rows * cols; i++) if (!excluded.has(i)) candidates.push(i)

  // Partial Fisher–Yates shuffle: pick `mines` random candidates.
  for (let i = 0; i < mines; i++) {
    const j = i + Math.floor(rng() * (candidates.length - i))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  const mineKeys = new Set(candidates.slice(0, mines))

  const withMines = board.map((row, y) =>
    row.map((cell, x) => ({ ...cell, mine: mineKeys.has(key({ x, y })) })),
  )
  return withMines.map((row, y) =>
    row.map((cell, x) => ({
      ...cell,
      adjacent: neighbors(withMines, { x, y }).filter((p) => withMines[p.y][p.x].mine).length,
    })),
  )
}
