export const TERAMINOS = {
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
export type TeraminoKeys = keyof typeof TERAMINOS;

export enum TeraminoColors {
    I=1, L, J, O, S, Z, T,
}

export interface Teramino { 
  piece: number[][], 
  rotation: keyof typeof Rotations,
  type: TeraminoKeys,
}
 
export enum Moves {
    DOWN = "d",
    LEFT = "l",
    RIGHT = "r",
    ROTATE = "t",
    SCROLL = "s",
}

export enum GameStates {
    NOGAME,
    INGAME,
    PAUSE,
    GAMEOVER,
}

export interface Coords { x: number, y: number }

export enum Rotations {
    R_0 = "0",
    R_R = "R", 
    R_2 = "2",
    R_L = "L",
}
export type RotationsKeys = keyof typeof Rotations;

export interface WallKick {
    "0R": number[][];
    "R0": number[][];
    "R2": number[][];
    "2R": number[][];
    "2L": number[][];
    "L2": number[][];
    "L0": number[][];
    "0L": number[][];
}

export const WALL_KICK_JLSTZ: WallKick = {
    "0R": [[-1, 0], [-1,  1], [0, -2], [-1, -2]],
    "R0": [[ 1, 0], [ 1, -1], [0,  2], [ 1,  2]],
    "R2": [[ 1, 0], [ 1, -1], [0,  2], [ 1,  2]],
    "2R": [[-1, 0], [-1,  1], [0, -2], [-1, -2]],
    "2L": [[ 1, 0], [ 1,  1], [0, -2], [ 1, -2]],
    "L2": [[-1, 0], [-1, -1], [0,  2], [-1,  2]],
    "L0": [[-1, 0], [-1, -1], [0,  2], [-1,  2]],
    "0L": [[ 1, 0], [ 1,  1], [0, -2], [ 1, -2]],
}

export const WALL_KICK_I: WallKick = {
    "0R": [[-2, 0], [ 1, 0], [-2, -1], [ 1,  2]],
    "R0": [[ 2, 0], [-1, 0], [ 2,  1], [-1, -2]],
    "R2": [[-1, 0], [ 2, 0], [-1,  2], [ 2, -1]],
    "2R": [[ 1, 0], [-2, 0], [ 1, -2], [-2,  1]],
    "2L": [[ 2, 0], [-1, 0], [ 2,  1], [-1, -2]],
    "L2": [[-2, 0], [ 1, 0], [-2, -1], [ 1,  2]],
    "L0": [[ 1, 0], [-2, 0], [ 1, -2], [-2,  1]],
    "0L": [[-1, 0], [ 2, 0], [-1,  2], [ 2, -1]],
};

export const getWallKickKey = (
    from: RotationsKeys, 
    to: RotationsKeys
): keyof WallKick => 
    `${Rotations[from]}${Rotations[to]}` as keyof WallKick ;
