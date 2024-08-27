export const PIECES = {
    I: [[true, true, true, true]],
    L: [[true, false, false], [true, true, true]],
    L2: [[false, false, true], [true, true, true]],
    Q: [[true, true], [true, true]],
    S: [[true, true, false], [false, true, true]],
    S2: [[false, true, true], [true, true, false]],
    A: [[false, true, false], [true, true, true]],
}

export type PiecesIdx = keyof typeof PIECES;

export enum Moves {
    DOWN = "d",
    UP = "u",
    LEFT = "l",
    RIGHT = "r",
    ROTATE = "t",
}

export enum GameStates {
    NOGAME,
    INGAME,
    PAUSE,
    GAMEOVER,
}

export interface Coords { x: number, y: number } 