import type { Board as BoardData } from '../game/types'
import { Cell } from './Cell'
import styles from './Board.module.css'

type BoardProps = {
  board: BoardData
}

export function Board({ board }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => (
            <Cell key={x} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}
