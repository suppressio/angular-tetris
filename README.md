🌐 **English** | [Italiano](README.it.md)

# Angular Tetris

The classic Tetris in the browser, built with Angular and RxJS: move and rotate the falling pieces, fill whole rows to clear them, and keep the stack from reaching the top.

![Angular Tetris](https://github.com/user-attachments/assets/dd5c9426-1d16-423d-8252-ca686873601b)

- Piece movement, rotation with wall kicks, line clearing and game over.
- Pause and resume at any time.
- Settings: game speed, sound on/off, effects and music volume.

> **Proof of concept, frozen.** This repository is kept as a stable snapshot (tag `v1-poc-final`): only documentation fixes and security updates, no new features. What it taught, and the plan for a reusable game engine, are in [docs/](#documentation).

---

## Install and run

You need [Node.js](https://nodejs.org) 20.19 or later (Angular 21).

```bash
npm install
npm start
```

Then open http://localhost:4200 and press **Start**.

## How to play

| Key | Action |
|---|---|
| ← / → | move the piece left / right |
| ↓ | move the piece down one row |
| ↑ | drop the piece all the way down |
| Space | rotate |
| Z | rotate the other way |
| P (or the Pause key) | pause / resume |

**Start** begins a new game; **Settings** sets the speed (1–10), turns the sounds on or off and sets the effects and music volume.

---

## Documentation

- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): build, tests, project structure, how the game loop works
- [docs/POC-ARCHIVE.md](docs/POC-ARCHIVE.md): what this proof of concept proved, and why it is frozen
- [docs/ENGINE-BLUEPRINT.md](docs/ENGINE-BLUEPRINT.md): architecture of the reusable 2D game engine that comes next
- [docs/ENGINE-ROADMAP.md](docs/ENGINE-ROADMAP.md): milestones to get there

## License

[MIT](LICENSE) © 2024 Daniele 'suppressio'.
