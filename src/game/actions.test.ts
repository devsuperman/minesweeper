import { describe, expect, it } from 'vitest'
import { chord, countFlags, getStatus, isLost, isWon, reveal, toggleFlag } from './actions'
import { boardFromLayout } from './testUtils'

describe('reveal', () => {
  it('reveals a single numbered cell without flood fill', () => {
    const board = reveal(boardFromLayout(['*..', '...', '...']), { x: 1, y: 0 })
    expect(board.flat().filter((c) => c.state === 'revealed')).toHaveLength(1)
  })

  it('flood-fills connected zero cells and their numbered border', () => {
    const board = reveal(boardFromLayout(['...*', '....', '....', '....']), { x: 0, y: 3 })
    expect(board.flat().every((c) => c.mine || c.state === 'revealed')).toBe(true)
    expect(board[0][3].state).toBe('hidden')
  })

  it('stops flood fill at numbers', () => {
    const board = reveal(boardFromLayout(['.....', '.....', '.....', '.....', '*....']), { x: 4, y: 0 })
    expect(board[4][0].state).toBe('hidden')
    expect(board[3][0].state).toBe('revealed') // number cell on the border
  })

  it('does not flood through flagged cells', () => {
    let board = boardFromLayout(['...', '...', '..*'])
    board = toggleFlag(board, { x: 1, y: 0 })
    board = reveal(board, { x: 0, y: 0 })
    expect(board[0][1].state).toBe('flagged')
  })

  it('does not reveal flagged cells directly', () => {
    const flagged = toggleFlag(boardFromLayout(['*.']), { x: 0, y: 0 })
    expect(reveal(flagged, { x: 0, y: 0 })).toBe(flagged)
  })

  it('does not mutate the input board', () => {
    const board = boardFromLayout(['...', '...', '..*'])
    reveal(board, { x: 0, y: 0 })
    expect(board.flat().every((c) => c.state === 'hidden')).toBe(true)
  })
})

describe('toggleFlag', () => {
  it('flags a hidden cell and unflags it again', () => {
    const board = boardFromLayout(['*.'])
    const flagged = toggleFlag(board, { x: 0, y: 0 })
    expect(flagged[0][0].state).toBe('flagged')
    expect(toggleFlag(flagged, { x: 0, y: 0 })[0][0].state).toBe('hidden')
  })

  it('ignores revealed cells', () => {
    const board = reveal(boardFromLayout(['*.']), { x: 1, y: 0 })
    expect(toggleFlag(board, { x: 1, y: 0 })).toBe(board)
  })
})

describe('chord', () => {
  // 1 at (1,1) has one adjacent mine at (0,0)
  const layout = ['*..', '...', '...']

  it('reveals the remaining neighbors when flags match the number', () => {
    let board = boardFromLayout(layout)
    board = reveal(board, { x: 1, y: 1 })
    board = toggleFlag(board, { x: 0, y: 0 })
    board = chord(board, { x: 1, y: 1 })
    expect(board.flat().filter((c) => c.state === 'hidden')).toHaveLength(0)
  })

  it('does nothing when the flag count does not match', () => {
    let board = reveal(boardFromLayout(layout), { x: 1, y: 1 })
    expect(chord(board, { x: 1, y: 1 })).toBe(board)
    board = toggleFlag(board, { x: 2, y: 2 }) // wrong flag, but count matches
    expect(isLost(chord(board, { x: 1, y: 1 }))).toBe(true) // reveals the real mine
  })
})

describe('status', () => {
  const layout = ['*.', '..']

  it('is idle before the first click and playing after', () => {
    const board = boardFromLayout(layout)
    expect(getStatus(board, false)).toBe('idle')
    expect(getStatus(reveal(board, { x: 1, y: 0 }), true)).toBe('playing')
  })

  it('is lost when a mine is revealed', () => {
    const board = reveal(boardFromLayout(layout), { x: 0, y: 0 })
    expect(isLost(board)).toBe(true)
    expect(getStatus(board, true)).toBe('lost')
  })

  it('is won when every safe cell is revealed', () => {
    let board = boardFromLayout(layout)
    for (const p of [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]) board = reveal(board, p)
    expect(isWon(board)).toBe(true)
    expect(getStatus(board, true)).toBe('won')
  })

  it('counts flags', () => {
    const board = toggleFlag(toggleFlag(boardFromLayout(layout), { x: 0, y: 0 }), { x: 1, y: 1 })
    expect(countFlags(board)).toBe(2)
  })
})
