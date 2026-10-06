export type CellState = 'hidden' | 'revealed' | 'flagged'

export type CellData = {
  mine: boolean
  adjacent: number
  state: CellState
}

export type Board = CellData[][]
