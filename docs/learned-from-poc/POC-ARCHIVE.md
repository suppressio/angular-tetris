# POC Archive Notes

## Purpose

This repository is kept as a historical Proof of Concept for:

- testing RxJS patterns in a browser game loop;
- validating Tetris core mechanics in Angular;
- collecting lessons learned before building a reusable engine.

## Recommended Repository Naming

- Suggested archive name: `poc-angular-tetris`.

This can be done as:

1. local folder rename;
2. repository rename on remote host;
3. update local git remotes.

## Freeze Policy

The repository should be treated as locked except for:

- documentation fixes;
- dependency/security maintenance if strictly needed;
- no new gameplay features.

## Suggested Git Actions

1. Create a final tag for the POC state.
2. Protect the default branch.
3. Add a short archive note in the repository description.

Example commands:

```bash
git tag -a v1-poc-final -m "Final Angular Tetris POC snapshot"
git push origin v1-poc-final
```

## What This POC Proved

- A timer-driven RxJS loop can drive gameplay.
- Rotation and wall-kick logic are viable.
- The main pain point is architecture separation:
  simulation state, render state, and orchestration are too coupled.

## Why Start a New Project

Starting clean reduces migration friction and allows a better layered architecture:

- engine core (framework-agnostic),
- game-specific logic modules,
- renderer and theme/audio adapters,
- host applications (Angular or others).