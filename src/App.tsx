import { Board } from '@/components/Board'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleBoard } from '@/game/sampleBoard'

function App() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-teal-700 p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            Minesweeper
            <Button size="sm" variant="outline">
              New game
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Board board={sampleBoard} />
        </CardContent>
      </Card>
    </main>
  )
}

export default App
