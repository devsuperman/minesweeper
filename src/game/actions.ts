import { neighbors } from './board'
import type { Board, GameStatus, Position } from './types'

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

/** Reveals a hidden cell. Opening a 0 cell flood-fills its connected area. Pure: returns a new board. */
export function reveal(board: Board, start: Position): Board {
  if (board[start.y][start.x].state !== 'hidden') return board

  const next = cloneBoard(board)
  const stack = [start]
  while (stack.length > 0) {
    const { x, y } = stack.pop()!
    const cell = next[y][x]
    if (cell.state !== 'hidden') continue
    cell.state = 'revealed'
    if (cell.adjacent === 0 && !cell.mine) stack.push(...neighbors(next, { x, y }))
  }
  return next
}

/** Toggles a flag on a hidden cell (or removes it from a flagged one). Revealed cells are untouched. */
export function toggleFlag(board: Board, { x, y }: Position): Board {
  const { state } = board[y][x]
  if (state === 'revealed') return board
  const next = cloneBoard(board)
  next[y][x].state = state === 'flagged' ? 'hidden' : 'flagged'
  return next
}

/**
 * Chord: on a revealed number whose adjacent flag count equals its number,
 * reveal all other neighbors. Otherwise nothing happens.
 */
export function chord(board: Board, pos: Position): Board {
  const cell = board[pos.y][pos.x]
  if (cell.state !== 'revealed' || cell.adjacent === 0) return board

  const around = neighbors(board, pos)
  const flags = around.filter((p) => board[p.y][p.x].state === 'flagged').length
  if (flags !== cell.adjacent) return board

  return around.reduce((acc, p) => reveal(acc, p), board)
}

export function countFlags(board: Board): number {
  return board.flat().filter((c) => c.state === 'flagged').length
}

export function isLost(board: Board): boolean {
  return board.flat().some((c) => c.mine && c.state === 'revealed')
}

export function isWon(board: Board): boolean {
  return !isLost(board) && board.flat().every((c) => c.mine || c.state === 'revealed')
}

/** Status derived from the board; `started` is false until the first click. */
export function getStatus(board: Board, started: boolean): GameStatus {
  if (isLost(board)) return 'lost'
  if (isWon(board)) return 'won'
  return started ? 'playing' : 'idle'
}
