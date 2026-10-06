# Rules of the Game

This project recreates the classic Windows Minesweeper.

## Goal

Reveal every cell that does **not** contain a mine. You win the moment the last safe cell is revealed. You lose if you reveal a mine.

## The board

A grid of cells. Each cell is either a **mine** or a **safe cell**. A safe cell shows a number from 0 to 8: the count of mines in its (up to) 8 neighbors (horizontal, vertical and diagonal). A cell showing 0 is displayed blank.

## Difficulty levels

| Level        | Columns | Rows | Mines |
|--------------|---------|------|-------|
| Beginner     | 9       | 9    | 10    |
| Intermediate | 16      | 16   | 40    |
| Expert       | 30      | 16   | 99    |
| Custom       | user    | user | user  |

Custom limits (as in Windows): width 8–30, height 8–24, mines 10 up to `(w-1)*(h-1)`.

## Cell states

Every cell is in exactly one state:

- **Hidden**: the initial state.
- **Flagged**: the player marked it as a suspected mine. A flagged cell cannot be revealed until the flag is removed.
- **Questioned** (optional `?` mark): a "not sure" marker. Behaves like hidden for revealing.
- **Revealed**: the cell's content is shown.

## Controls

| Action                                   | Input                                                         |
|------------------------------------------|---------------------------------------------------------------|
| Reveal a cell                            | Left click                                                    |
| Cycle hidden → flag → `?` → hidden       | Right click                                                   |
| **Chord**: reveal all neighbors at once  | Left click on a revealed number (or left+right click together) |
| Start a new game                         | Click the smiley face                                         |

## Revealing

1. Revealing a **mine** ends the game as a loss. The clicked mine is shown as exploded, all other mines are shown, and wrongly placed flags are marked as incorrect.
2. Revealing a **number** (1–8) reveals only that cell.
3. Revealing a **0 cell** triggers a **flood fill**: all connected 0 cells are revealed, plus the numbered cells bordering them. Flagged cells are not opened by the flood fill.

## First click is always safe

Mines are placed **after** the first click. The clicked cell (and, to guarantee an opening, ideally its neighbors) never contains a mine. The timer starts on that first click.

## Chording

Clicking a revealed number whose count equals the number of flagged neighbors reveals all the remaining hidden, unflagged neighbors. If any flag was misplaced, this will reveal a mine and lose the game. If the counts do not match, nothing happens.

## Header

- **Mine counter** (left): `total mines − flags placed`. It can go negative.
- **Smiley** (center): 🙂 playing, 😮 while the mouse is held down on a cell, 😎 won, 😵 lost. Clicking it resets the game.
- **Timer** (right): whole seconds since the first click, capped at 999. It stops on win or loss.

## Game status

```
idle ──first click──▶ playing ──reveal mine──▶ lost
                         │
                         └──all safe cells revealed──▶ won
any status ──reset──▶ idle
```

## Winning

When won, all remaining mines are automatically flagged and the counter shows 0.

## Best times (extra)

Best time per standard difficulty is saved in `localStorage`.
