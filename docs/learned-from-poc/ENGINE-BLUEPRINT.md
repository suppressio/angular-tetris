# Reusable Engine Blueprint

## Vision

Build a small reusable 2D browser game engine as a TypeScript library, then implement games (Tetris, Snake, Bomberman-like, Chess) as separate modules.

## Design Principles

1. Pure core, reactive shell.
2. Clear separation between simulation and rendering.
3. Framework-agnostic engine APIs.
4. Pluggable graphics, CSS themes, and sounds.
5. Game rules as isolated business logic.

## Layered Architecture

## 1) Engine Core

Responsibilities:

- game clock and fixed simulation steps;
- command intake;
- deterministic update cycle;
- event emission.

Core interfaces:

- `EngineState`
- `EngineCommand`
- `EngineEvent`
- `GameReducer<TState, TCommand, TEvent>`

## 2) Game Logic Modules

Each game owns:

- state model;
- reducer/rules;
- domain events;
- win/lose conditions.

Examples:

- `@games/tetris`
- `@games/snake`
- `@games/chess`

## 3) Render Adapters

Renderer layer translates game state into visuals without changing business state.

Possible adapters:

- DOM grid renderer;
- Canvas renderer;
- optional SVG renderer.

## 4) Skin and Audio Packs

User-customizable resources:

- CSS themes;
- sprite packs;
- sound packs mapped by event name.

## 5) Host Applications

Framework app (Angular) handles:

- mounting engine instance;
- wiring inputs;
- selecting renderer/theme/audio packs;
- UI controls (start, pause, settings).

## Runtime Flow

1. Input adapter emits commands.
2. Tick source emits simulation step events.
3. Reducer computes next state.
4. Engine emits domain events.
5. Renderer and audio adapters react.

## Timing Model

Keep two clocks conceptually separated:

- simulation tick (fixed step);
- render cadence (UI refresh cadence).

For grid games, start simple:

- fixed simulation step;
- render only when state changes.

## Minimal Public API (Draft)

```ts
interface EngineConfig<TState, TCommand, TEvent> {
  initialState: TState;
  reducer: (state: TState, input: TCommand | { type: 'tick' }) => {
    state: TState;
    events?: TEvent[];
  };
}

interface Engine<TState, TCommand, TEvent> {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  dispatch(command: TCommand): void;
  state$(): unknown;
  events$(): unknown;
}
```

## Packaging Suggestion

Monorepo with packages:

- `packages/engine-core`
- `packages/renderer-dom`
- `packages/game-tetris`
- `apps/angular-host`

This keeps boundaries explicit while enabling quick local iteration.