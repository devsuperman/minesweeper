import { Board } from './components/Board'
import { sampleBoard } from './game/sampleBoard'

function App() {
  return (
    <main>
      <h1>Minesweeper</h1>
      <Board board={sampleBoard} />
    </main>
  )
}

export default App
