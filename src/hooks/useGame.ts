import { useReducer } from 'react'
import { countFlags, getStatus } from '@/game/actions'
import { createGame, gameReducer } from '@/game/reducer'
import { DIFFICULTIES, type Difficulty, type Position } from '@/game/types'

// Randomness lives out here (event handlers / initializer), never inside the reducer.
const newSeed = () => Math.floor(Math.random() * 2 ** 32)

export function useGame(initial: Difficulty = DIFFICULTIES.beginner) {
  // The third argument is a lazy initializer: it runs once, on the first render only.
  const [state, dispatch] = useReducer(gameReducer, initial, (d) => createGame(d, newSeed()))

  // Derived state: computed on every render from `state`, never stored.
  const status = getStatus(state.board, state.started)
  const minesLeft = state.difficulty.mines - countFlags(state.board)

  return {
    board: state.board,
    status,
    minesLeft,
    reveal: (pos: Position) => dispatch({ type: 'REVEAL', pos }),
    flag: (pos: Position) => dispatch({ type: 'FLAG', pos }),
    chord: (pos: Position) => dispatch({ type: 'CHORD', pos }),
    reset: (difficulty?: Difficulty) => dispatch({ type: 'RESET', seed: newSeed(), difficulty }),
  }
}
