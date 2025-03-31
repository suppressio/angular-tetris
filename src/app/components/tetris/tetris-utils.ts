import { TETRIS } from "src/app/models/contants.model";
import { Rotations, RotationsKeys, Teramino, TeraminoKeys, TERAMINOS, WALL_KICK_I, WALL_KICK_JLSTZ, WallKick } from "src/app/models/game.model";

export abstract class TetrisUtils {
    /** Random number from min to max (min and max included) */
    public static rnd = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1) + min);

    public static getRandomPiece(): Teramino {
        const keys: TeraminoKeys[] = Object.keys(TERAMINOS) as TeraminoKeys[];
        const randomIndex: number = this.rnd(0, keys.length - 1);
        const color: number = randomIndex + 1; // To use random color: __randomIntFromInterval(1, 7);
        return {
            piece: TERAMINOS[keys[randomIndex]].map(y => y.map(x => x ? color : TETRIS.EMPTY_BLOCK)),
            type: keys[randomIndex],
            rotation: Object.keys(Rotations)[Rotations.R_0] as RotationsKeys,
        };
    }

    public static rotate(t: Teramino, toLeft?: true): Teramino {
        const numRows = t.piece.length;
        const numCols = t.piece[0].length;

        const rotatedPiece: number[][] =
            Array.from({ length: numCols }, () =>
                Array(numRows).fill(false));

        for (let row = 0; row < numRows; row++)
            for (let col = 0; col < numCols; col++)
                rotatedPiece[col][numRows - 1 - row] =
                    t.piece[row][col];

        const idx = Object.keys(Rotations).indexOf(t.rotation);

        return {
            ...t,
            piece: rotatedPiece,
            rotation: Object.keys(Rotations)[(idx + (toLeft ? -1 : 1)) % 4] as RotationsKeys,
        };
    }

    public static wallKick(currentPiece: Teramino, rotated: Teramino): number[][] {
        switch (rotated.type) {
            case 'J':
            case 'L':
            case 'S':
            case 'T':
            case 'Z':
                return WALL_KICK_JLSTZ[
                    this._getWallKickKey(currentPiece.rotation, rotated.rotation)];
            case 'I':
                return WALL_KICK_I[
                    this._getWallKickKey(currentPiece.rotation, rotated.rotation)];
            default:
                return [];
        }
    }

    private static _getWallKickKey = (
        from: RotationsKeys,
        to: RotationsKeys
    ): keyof WallKick =>
        `${Rotations[from]}${Rotations[to]}` as keyof WallKick;
} 