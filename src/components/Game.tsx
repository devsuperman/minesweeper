import { Board } from '@/components/Board'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGame } from '@/hooks/useGame'

const STATUS_TEXT = {
  idle: 'Click any cell to start',
  playing: 'Good luck!',
  won: 'You win! 😎',
  lost: 'Boom! 😵',
} as const

export function Game() {
  // All game state lives here (lifted up) and flows down as props.
  const { board, status, minesLeft, reveal, flag, chord, reset } = useGame()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          Minesweeper
          <Button size="sm" variant="outline" onClick={() => reset()}>
            New game
          </Button>
        </CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{STATUS_TEXT[status]}</span>
          <span>💣 {minesLeft}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Board board={board} onReveal={reveal} onFlag={flag} onChord={chord} />
      </CardContent>
    </Card>
  )
}
