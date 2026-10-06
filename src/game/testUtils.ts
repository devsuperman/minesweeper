import type { Board, CellData } from './types'

/**
 * Builds a board from a text layout: '*' = mine, anything else = safe.
 * Adjacent counts are computed; all cells start hidden.
 */
export function boardFromLayout(rows: string[]): Board {
  const mine = (x: number, y: number) => rows[y]?.[x] === '*'
  return rows.map((row, y) =>
    [...row].map((_, x): CellData => {
      let adjacent = 0
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && mine(x + dx, y + dy)) adjacent++
      return { mine: mine(x, y), adjacent, state: 'hidden' }
    }),
  )
}
