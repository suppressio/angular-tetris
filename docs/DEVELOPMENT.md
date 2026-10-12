🌐 **English** | [Italiano](DEVELOPMENT.it.md)

# Development

How to build and test Angular Tetris, and how the code is organised. To install and play, see the [README](../README.md).

## Commands

```bash
npm start        # development server on http://localhost:4200
npm run build    # production build in dist/
npm test         # unit tests (Karma, headless Chromium: set CHROME_BIN if it is not /usr/bin/chromium)
npm run lint     # ESLint
```

## Project structure

```
src/app/
├── components/
│   ├── tetris/          ← the game: board, pieces, moves, line clearing (tetris-utils.ts: rotation, wall kicks, random pieces)
│   └── dialog/          ← Settings dialog
├── models/              ← constants, game types (moves, states, rotations), settings
└── services/            ← game state, keyboard input, settings, sounds
src/assets/audio/        ← sound effects and music
```

## How the game works

- **Game loop**: an RxJS `timer` moves the current piece down one row at every tick; the tick interval comes from the speed set in Settings. When a piece cannot go further down it is locked, full rows are removed, and the next piece enters; if it collides at once, the game is over.
- **Input**: `InputsService` turns each key into a move (down, left, right, rotate, drop) or the pause toggle; the component applies the move only if the piece fits.
- **Rotation**: if a rotated piece does not fit, a list of wall-kick offsets is tried before giving up.
- **States**: `GameStateService` keeps the state in a `BehaviorSubject`: `NOGAME`, `INGAME`, `PAUSE`, `GAMEOVER`. The message on the board ("Pause", "Game Over") is derived from it.

The limits of this design, and the engine that should replace it, are in [POC-ARCHIVE.md](POC-ARCHIVE.md) and [ENGINE-BLUEPRINT.md](ENGINE-BLUEPRINT.md).
