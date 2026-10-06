import type { CellData } from '../game/types'
import styles from './Cell.module.css'

type CellProps = {
  cell: CellData
}

function content(cell: CellData): string {
  if (cell.state === 'flagged') return '🚩'
  if (cell.state === 'hidden') return ''
  if (cell.mine) return '💣'
  return cell.adjacent > 0 ? String(cell.adjacent) : ''
}

export function Cell({ cell }: CellProps) {
  const revealed = cell.state === 'revealed'
  const className = [
    styles.cell,
    revealed ? styles.revealed : styles.hidden,
    revealed && cell.adjacent > 0 ? styles[`n${cell.adjacent}`] : '',
  ].join(' ')

  return <div className={className}>{content(cell)}</div>
}
