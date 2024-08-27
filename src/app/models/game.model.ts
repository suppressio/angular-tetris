export const PIECES = {
    I: [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false],
    ],
    L: [
        [true, false, false], 
        [true, true, true],
        [false, false, false],
    ],
    J: [
        [false, false, true],
        [true, true, true],
        [false, false, false],
    ],
    O: [
        [true, true],
        [true, true],
    ],
    S: [
        [true, true, false],
        [false, true, true],
        [false, false, false],
    ],
    Z: [
        [false, true, true],
        [true, true, false],
        [false, false, false],
    ],
    T: [
        [false, false, false],
        [true, true, true],
        [false, true, false], 
    ],
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