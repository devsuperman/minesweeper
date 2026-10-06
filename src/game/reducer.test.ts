import { describe, expect, it } from 'vitest'
import { getStatus } from './actions'
import { createGame, gameReducer, mulberry32 } from './reducer'
import { DIFFICULTIES } from './types'

const start = () => createGame(DIFFICULTIES.beginner, 42)
const mineCount = (s: ReturnType<typeof start>) => s.board.flat().filter((c) => c.mine).length

describe('mulberry32', () => {
  it('is deterministic and within [0, 1)', () => {
    const a = mulberry32(1)
    const b = mulberry32(1)
    for (let i = 0; i < 20; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('gameReducer', () => {
  it('starts idle with no mines placed', () => {
    const s = start()
    expect(getStatus(s.board, s.started)).toBe('idle')
    expect(mineCount(s)).toBe(0)
  })

  it('places mines on the first reveal, keeping that cell safe', () => {
    const s = gameReducer(start(), { type: 'REVEAL', pos: { x: 4, y: 4 } })
    expect(s.started).toBe(true)
    expect(mineCount(s)).toBe(10)
    expect(s.board[4][4].state).toBe('revealed')
    expect(s.board[4][4].mine).toBe(false)
  })

  it('is pure: same state + action gives the same result', () => {
    const action = { type: 'REVEAL', pos: { x: 0, y: 0 } } as const
    expect(gameReducer(start(), action)).toEqual(gameReducer(start(), action))
  })

  it('does not place mines again on later reveals', () => {
    const first = gameReducer(start(), { type: 'REVEAL', pos: { x: 4, y: 4 } })
    const hidden = first.board.flat().findIndex((c) => c.state === 'hidden' && !c.mine)
    const pos = { x: hidden % 9, y: Math.floor(hidden / 9) }
    const second = gameReducer(first, { type: 'REVEAL', pos })
    expect(second.board.map((r) => r.map((c) => c.mine))).toEqual(first.board.map((r) => r.map((c) => c.mine)))
  })

  it('toggles flags, including before the first click', () => {
    const flagged = gameReducer(start(), { type: 'FLAG', pos: { x: 0, y: 0 } })
    expect(flagged.board[0][0].state).toBe('flagged')
    expect(flagged.started).toBe(false)
    const revealed = gameReducer(flagged, { type: 'REVEAL', pos: { x: 0, y: 0 } })
    expect(revealed).toBe(flagged) // flagged cells cannot be revealed
  })

  it('freezes the board after a loss', () => {
    let s = gameReducer(start(), { type: 'REVEAL', pos: { x: 4, y: 4 } })
    const mine = s.board.flat().findIndex((c) => c.mine)
    s = gameReducer(s, { type: 'REVEAL', pos: { x: mine % 9, y: Math.floor(mine / 9) } })
    expect(getStatus(s.board, s.started)).toBe('lost')
    expect(gameReducer(s, { type: 'FLAG', pos: { x: 0, y: 0 } })).toBe(s)
  })

  it('RESET starts a fresh game, optionally with a new difficulty', () => {
    const played = gameReducer(start(), { type: 'REVEAL', pos: { x: 4, y: 4 } })
    const reset = gameReducer(played, { type: 'RESET', seed: 7, difficulty: DIFFICULTIES.expert })
    expect(reset.started).toBe(false)
    expect(reset.board).toHaveLength(16)
    expect(reset.board[0]).toHaveLength(30)
    expect(reset.seed).toBe(7)
  })
})
