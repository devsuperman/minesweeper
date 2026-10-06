import type { Board as BoardData, Position } from '@/game/types'
import { Cell } from './Cell'
import styles from './Board.module.css'

type BoardProps = {
  board: BoardData
  onReveal: (pos: Position) => void
  onFlag: (pos: Position) => void
  onChord: (pos: Position) => void
}

export function Board({ board, onReveal, onFlag, onChord }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => {
            const pos = { x, y }
            return (
              <Cell
                key={x}
                cell={cell}
                // Clicking a revealed number chords; clicking anything else reveals.
                onClick={() => (cell.state === 'revealed' ? onChord(pos) : onReveal(pos))}
                onFlag={() => onFlag(pos)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
