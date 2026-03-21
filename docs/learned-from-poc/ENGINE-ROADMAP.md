# Engine Implementation Roadmap

## Goal

Move from archived POC to a reusable engine plus game modules, minimizing rewrite risk by shipping in small milestones.

## Milestone 0 - Archive Finalization

- mark this repository as POC snapshot;
- create and push final tag;
- freeze feature development.

Exit criteria:

- repository status is explicit;
- baseline state is reproducible.

## Milestone 1 - Engine Core Skeleton

- create new workspace/repository for engine;
- define core contracts (`State`, `Command`, `Event`, `Reducer`);
- implement engine loop with fixed simulation tick;
- expose state and events streams.

Exit criteria:

- demo reducer can run end-to-end with synthetic commands.

## Milestone 2 - First Vertical Slice with Snake

- implement `game-snake` using engine interfaces;
- build simple renderer adapter (DOM or Canvas);
- wire keyboard input adapter.

Why Snake first:

- small rule set;
- verifies movement, collision, and timing quickly.

Exit criteria:

- playable snake demo with deterministic behavior.

## Milestone 3 - Tetris on Top of Engine

- implement Tetris state and reducer module;
- add line clear, lock, spawn collision, wall kicks;
- add domain events (line clear, lock, game over).

Exit criteria:

- playable Tetris using only engine APIs.

## Milestone 4 - Theming and Audio Extension Points

- add renderer skin contract;
- add audio event mapping contract;
- ship at least one default theme and sound pack.

Exit criteria:

- host app can swap CSS/audio assets without changing game rules.

## Milestone 5 - Stabilization

- test coverage on engine and game reducers;
- basic benchmarks and performance checks;
- API cleanup and documentation.

Exit criteria:

- public API considered stable for additional game modules.

## Test Strategy by Priority

1. reducer determinism tests;
2. command-to-state transition tests;
3. timing behavior tests;
4. renderer adapter contract tests.

## Risks and Mitigations

- Risk: over-engineering too early.
  Mitigation: always keep one playable vertical slice.

- Risk: mixing rendering with business logic.
  Mitigation: enforce reducer purity and render adapters.

- Risk: API churn while adding games.
  Mitigation: version internal contracts and add compatibility tests.