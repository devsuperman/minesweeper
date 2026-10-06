import type { MouseEvent } from 'react'
import type { CellData } from '@/game/types'
import styles from './Cell.module.css'

type CellProps = {
  cell: CellData
  onClick: () => void
  onFlag: () => void
}

function content(cell: CellData): string {
  if (cell.state === 'flagged') return '🚩'
  if (cell.state === 'hidden') return ''
  if (cell.mine) return '💣'
  return cell.adjacent > 0 ? String(cell.adjacent) : ''
}

export function Cell({ cell, onClick, onFlag }: CellProps) {
  const revealed = cell.state === 'revealed'
  const className = [
    styles.cell,
    revealed ? styles.revealed : styles.hidden,
    revealed && cell.adjacent > 0 ? styles[`n${cell.adjacent}`] : '',
  ].join(' ')

  // Right click: stop the browser's context menu, then flag instead.
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    onFlag()
  }

  return (
    <div className={className} onClick={onClick} onContextMenu={handleContextMenu}>
      {content(cell)}
    </div>
  )
}
