import type { Board, CellData, CellState } from './types'

// Phase 1 only: a hard-coded board so we can focus on rendering.
// Replaced by real board generation in Phase 2.
// Legend: '*' mine, digit = revealed number, '.' = revealed empty,
//         '#' = hidden safe cell, 'F' = flagged mine
const LAYOUT = [
  '..1#F#####',
  '..1#######',
  '111#######',
  '#########*',
  '##########',
  '.1########',
  '.1#######*',
  '.111######',
  '..........',
]

function parse(char: string): CellData {
  if (char === 'F') return { mine: true, adjacent: 0, state: 'flagged' }
  if (char === '*') return { mine: true, adjacent: 0, state: 'hidden' }
  const state: CellState = char === '#' ? 'hidden' : 'revealed'
  return { mine: false, adjacent: char === '.' || char === '#' ? 0 : Number(char), state }
}

export const sampleBoard: Board = LAYOUT.map((row) => [...row].map(parse))
