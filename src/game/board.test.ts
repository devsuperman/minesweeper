import { describe, expect, it } from 'vitest'
import { createEmptyBoard, neighbors, placeMines } from './board'

// Deterministic pseudo-random generator for reproducible tests.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

describe('createEmptyBoard', () => {
  it('creates rows x cols hidden, mine-free cells', () => {
    const board = createEmptyBoard(3, 5)
    expect(board).toHaveLength(3)
    expect(board[0]).toHaveLength(5)
    expect(board.flat().every((c) => !c.mine && c.state === 'hidden')).toBe(true)
  })
})

describe('neighbors', () => {
  const board = createEmptyBoard(3, 3)
  it('returns 8 neighbors in the middle', () => expect(neighbors(board, { x: 1, y: 1 })).toHaveLength(8))
  it('returns 3 neighbors in a corner', () => expect(neighbors(board, { x: 0, y: 0 })).toHaveLength(3))
  it('returns 5 neighbors on an edge', () => expect(neighbors(board, { x: 1, y: 0 })).toHaveLength(5))
})

describe('placeMines', () => {
  it('places exactly the requested number of mines', () => {
    const board = placeMines(createEmptyBoard(9, 9), 10, { x: 4, y: 4 }, seeded(1))
    expect(board.flat().filter((c) => c.mine)).toHaveLength(10)
  })

  it('keeps the first-click cell and its neighbors mine-free', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const empty = createEmptyBoard(9, 9)
      const board = placeMines(empty, 10, { x: 4, y: 4 }, seeded(seed))
      const protectedCells = [{ x: 4, y: 4 }, ...neighbors(empty, { x: 4, y: 4 })]
      expect(protectedCells.every((p) => !board[p.y][p.x].mine)).toBe(true)
      expect(board[4][4].adjacent).toBe(0)
    }
  })

  it('computes adjacent counts', () => {
    const board = placeMines(createEmptyBoard(9, 9), 10, { x: 0, y: 0 }, seeded(7))
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        const expected = neighbors(board, { x, y }).filter((p) => board[p.y][p.x].mine).length
        expect(cell.adjacent).toBe(expected)
      }),
    )
  })

  it('does not mutate the input board', () => {
    const empty = createEmptyBoard(5, 5)
    placeMines(empty, 5, { x: 2, y: 2 }, seeded(3))
    expect(empty.flat().some((c) => c.mine)).toBe(false)
  })

  it('still protects the clicked cell on a crowded board', () => {
    const board = placeMines(createEmptyBoard(3, 3), 8, { x: 1, y: 1 }, seeded(2))
    expect(board[1][1].mine).toBe(false)
    expect(board.flat().filter((c) => c.mine)).toHaveLength(8)
  })

  it('throws when there are too many mines', () => {
    expect(() => placeMines(createEmptyBoard(2, 2), 4, { x: 0, y: 0 })).toThrow()
  })
})
