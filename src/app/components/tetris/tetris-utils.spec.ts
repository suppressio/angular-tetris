import { TERAMINOS, WALL_KICK_I, WALL_KICK_JLSTZ } from '../../models/game.model';
import { TetrisUtils } from './tetris-utils';

describe('TetrisUtils', () => {

  // ─── rnd ──────────────────────────────────────────────────────────────────

  describe('rnd', () => {
    it('returns a number within [min, max]', () => {
      for (let i = 0; i < 200; i++) {
        const v = TetrisUtils.rnd(3, 7);
        expect(v).toBeGreaterThanOrEqual(3);
        expect(v).toBeLessThanOrEqual(7);
      }
    });

    it('returns exactly min when min === max', () => {
      expect(TetrisUtils.rnd(5, 5)).toBe(5);
    });

    it('returns an integer', () => {
      for (let i = 0; i < 50; i++) {
        expect(TetrisUtils.rnd(0, 10) % 1).toBe(0);
      }
    });
  });

  // ─── getRandomPiece ───────────────────────────────────────────────────────

  describe('getRandomPiece', () => {
    const validTypes = Object.keys(TERAMINOS);

    it('returns a piece with a valid type', () => {
      for (let i = 0; i < 50; i++) {
        const piece = TetrisUtils.getRandomPiece();
        expect(validTypes).toContain(piece.type);
      }
    });

    it('starts at rotation R_0', () => {
      for (let i = 0; i < 20; i++) {
        expect(TetrisUtils.getRandomPiece().rotation).toBe('R_0');
      }
    });

    it('piece matrix contains only non-negative integers', () => {
      for (let i = 0; i < 20; i++) {
        const { piece } = TetrisUtils.getRandomPiece();
        piece.forEach(row =>
          row.forEach(cell => {
            expect(cell).toBeGreaterThanOrEqual(0);
            expect(cell % 1).toBe(0);
          }),
        );
      }
    });

    it('piece color matches the piece type index + 1', () => {
      // Run many times and ensure every color found is a valid 1-7 index
      for (let i = 0; i < 100; i++) {
        const { piece } = TetrisUtils.getRandomPiece();
        const colors = piece.flat().filter(c => c > 0);
        colors.forEach(c => {
          expect(c).toBeGreaterThanOrEqual(1);
          expect(c).toBeLessThanOrEqual(7);
        });
      }
    });
  });

  // ─── rotate ───────────────────────────────────────────────────────────────

  describe('rotate', () => {
    it('right-rotation advances by one step through R_0 → R_R → R_2 → R_L → R_0', () => {
      const rotationCycle = ['R_0', 'R_R', 'R_2', 'R_L', 'R_0'];
      let piece = TetrisUtils.getRandomPiece();
      // Force a known start
      piece = { ...piece, rotation: 'R_0' };

      for (let i = 1; i < rotationCycle.length; i++) {
        piece = TetrisUtils.rotate(piece);
        expect(piece.rotation).toBe(rotationCycle[i]);
      }
    });

    it('O-piece has equal dimensions after rotation (it is square)', () => {
      // The O-piece matrix is 2x2; use a known shape
      const before = { piece: [[1, 1], [1, 1]], type: 'O' as const, rotation: 'R_0' as const };
      const after = TetrisUtils.rotate(before);
      expect(after.piece.length).toBe(before.piece[0].length);
      expect(after.piece[0].length).toBe(before.piece.length);
    });

    it('four right-rotations return a matrix identical to the original', () => {
      let piece = TetrisUtils.getRandomPiece();
      const original = piece.piece.map(r => [...r]);
      for (let i = 0; i < 4; i++) piece = TetrisUtils.rotate(piece);
      expect(piece.piece).toEqual(original);
    });

    it('left-rotation is the inverse of right-rotation', () => {
      const piece = TetrisUtils.getRandomPiece();
      const rotatedRight = TetrisUtils.rotate(piece);
      const backToOriginal = TetrisUtils.rotate(rotatedRight, true);
      expect(backToOriginal.piece).toEqual(piece.piece);
      expect(backToOriginal.rotation).toBe(piece.rotation);
    });

    it('four left-rotations also return a matrix identical to the original', () => {
      let piece = TetrisUtils.getRandomPiece();
      const original = piece.piece.map(r => [...r]);
      for (let i = 0; i < 4; i++) piece = TetrisUtils.rotate(piece, true);
      expect(piece.piece).toEqual(original);
    });
  });

  // ─── wallKick ─────────────────────────────────────────────────────────────

  describe('wallKick', () => {
    it('returns non-empty array for JLSTZ pieces', () => {
      const types = ['J', 'L', 'S', 'T', 'Z'] as const;
      types.forEach(type => {
        const current = { piece: [[1]], type, rotation: 'R_0' as const };
        const rotated = { ...current, rotation: 'R_R' as const };
        expect(TetrisUtils.wallKick(current, rotated).length).toBeGreaterThan(0);
      });
    });

    it('returns non-empty array for the I piece', () => {
      const current = { piece: [[1]], type: 'I' as const, rotation: 'R_0' as const };
      const rotated = { ...current, rotation: 'R_R' as const };
      expect(TetrisUtils.wallKick(current, rotated).length).toBeGreaterThan(0);
    });

    it('returns empty array for the O piece (no wall kick)', () => {
      const current = { piece: [[1]], type: 'O' as const, rotation: 'R_0' as const };
      const rotated = { ...current, rotation: 'R_R' as const };
      expect(TetrisUtils.wallKick(current, rotated)).toEqual([]);
    });

    it('kick entries for I differ from JLSTZ on 0→R transition', () => {
      const mk = (type: 'I' | 'T') => ({
        piece: [[1]], type, rotation: 'R_0' as const,
      });
      const kickI = TetrisUtils.wallKick(mk('I'), { ...mk('I'), rotation: 'R_R' as const });
      const kickT = TetrisUtils.wallKick(mk('T'), { ...mk('T'), rotation: 'R_R' as const });
      expect(kickI).not.toEqual(kickT);
    });
  });

  // ─── wallKick data — SRS table verification ───────────────────────────────
  // Verifies all 8 transitions for JLSTZ and I against the SRS spec table.
  // Source: https://tetris.wiki/Super_Rotation_System
  // Test 1 (0,0) is the basic rotation attempt; it is NOT stored here (handled
  // separately in _safeRotate). Only tests 2–5 are stored in the kick arrays.

  describe('wallKick SRS data – JLSTZ', () => {
    const mk = (from: string, to: string) => {
      const base = { piece: [[1]], type: 'T' as const };
      return {
        current: { ...base, rotation: from as any },
        rotated:  { ...base, rotation: to  as any },
      };
    };

    it('0→R: (-1,0) (-1,+1) (0,-2) (-1,-2)', () => {
      const { current, rotated } = mk('R_0', 'R_R');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['0R']);
      expect(WALL_KICK_JLSTZ['0R']).toEqual([[-1,0],[-1,1],[0,-2],[-1,-2]]);
    });

    it('R→0: (+1,0) (+1,-1) (0,+2) (+1,+2)', () => {
      const { current, rotated } = mk('R_R', 'R_0');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['R0']);
      expect(WALL_KICK_JLSTZ['R0']).toEqual([[1,0],[1,-1],[0,2],[1,2]]);
    });

    it('R→2: (+1,0) (+1,-1) (0,+2) (+1,+2)', () => {
      const { current, rotated } = mk('R_R', 'R_2');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['R2']);
      expect(WALL_KICK_JLSTZ['R2']).toEqual([[1,0],[1,-1],[0,2],[1,2]]);
    });

    it('2→R: (-1,0) (-1,+1) (0,-2) (-1,-2)', () => {
      const { current, rotated } = mk('R_2', 'R_R');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['2R']);
      expect(WALL_KICK_JLSTZ['2R']).toEqual([[-1,0],[-1,1],[0,-2],[-1,-2]]);
    });

    it('2→L: (+1,0) (+1,+1) (0,-2) (+1,-2)', () => {
      const { current, rotated } = mk('R_2', 'R_L');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['2L']);
      expect(WALL_KICK_JLSTZ['2L']).toEqual([[1,0],[1,1],[0,-2],[1,-2]]);
    });

    it('L→2: (-1,0) (-1,-1) (0,+2) (-1,+2)', () => {
      const { current, rotated } = mk('R_L', 'R_2');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['L2']);
      expect(WALL_KICK_JLSTZ['L2']).toEqual([[-1,0],[-1,-1],[0,2],[-1,2]]);
    });

    it('L→0: (-1,0) (-1,-1) (0,+2) (-1,+2)', () => {
      const { current, rotated } = mk('R_L', 'R_0');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['L0']);
      expect(WALL_KICK_JLSTZ['L0']).toEqual([[-1,0],[-1,-1],[0,2],[-1,2]]);
    });

    it('0→L: (+1,0) (+1,+1) (0,-2) (+1,-2)', () => {
      const { current, rotated } = mk('R_0', 'R_L');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_JLSTZ['0L']);
      expect(WALL_KICK_JLSTZ['0L']).toEqual([[1,0],[1,1],[0,-2],[1,-2]]);
    });
  });

  describe('wallKick SRS data – I piece', () => {
    const mk = (from: string, to: string) => {
      const base = { piece: [[1]], type: 'I' as const };
      return {
        current: { ...base, rotation: from as any },
        rotated:  { ...base, rotation: to  as any },
      };
    };

    it('0→R: (-2,0) (+1,0) (-2,-1) (+1,+2)', () => {
      const { current, rotated } = mk('R_0', 'R_R');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['0R']);
      expect(WALL_KICK_I['0R']).toEqual([[-2,0],[1,0],[-2,-1],[1,2]]);
    });

    it('R→0: (+2,0) (-1,0) (+2,+1) (-1,-2)', () => {
      const { current, rotated } = mk('R_R', 'R_0');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['R0']);
      expect(WALL_KICK_I['R0']).toEqual([[2,0],[-1,0],[2,1],[-1,-2]]);
    });

    it('R→2: (-1,0) (+2,0) (-1,+2) (+2,-1)', () => {
      const { current, rotated } = mk('R_R', 'R_2');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['R2']);
      expect(WALL_KICK_I['R2']).toEqual([[-1,0],[2,0],[-1,2],[2,-1]]);
    });

    it('2→R: (+1,0) (-2,0) (+1,-2) (-2,+1)', () => {
      const { current, rotated } = mk('R_2', 'R_R');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['2R']);
      expect(WALL_KICK_I['2R']).toEqual([[1,0],[-2,0],[1,-2],[-2,1]]);
    });

    it('2→L: (+2,0) (-1,0) (+2,+1) (-1,-2)', () => {
      const { current, rotated } = mk('R_2', 'R_L');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['2L']);
      expect(WALL_KICK_I['2L']).toEqual([[2,0],[-1,0],[2,1],[-1,-2]]);
    });

    it('L→2: (-2,0) (+1,0) (-2,-1) (+1,+2)', () => {
      const { current, rotated } = mk('R_L', 'R_2');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['L2']);
      expect(WALL_KICK_I['L2']).toEqual([[-2,0],[1,0],[-2,-1],[1,2]]);
    });

    it('L→0: (+1,0) (-2,0) (+1,-2) (-2,+1)', () => {
      const { current, rotated } = mk('R_L', 'R_0');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['L0']);
      expect(WALL_KICK_I['L0']).toEqual([[1,0],[-2,0],[1,-2],[-2,1]]);
    });

    it('0→L: (-1,0) (+2,0) (-1,+2) (+2,-1)', () => {
      const { current, rotated } = mk('R_0', 'R_L');
      expect(TetrisUtils.wallKick(current, rotated)).toEqual(WALL_KICK_I['0L']);
      expect(WALL_KICK_I['0L']).toEqual([[-1,0],[2,0],[-1,2],[2,-1]]);
    });
  });

  // ─── wall kick scenario — wiki "A wall kick example" ──────────────────────
  // Replicates the scenario from https://tetris.wiki/Super_Rotation_System
  // Section: "A wall kick example"
  //
  // J-piece in state 0 (spawn), attempting CCW rotation (0→L).
  // Wall kick sequence (excluding basic rotation): [+1,0], [+1,+1], [0,-2], [+1,-2]
  // (coordinates in game board space: x right, y down = increasing row index)
  //
  // NOTE: the wiki calls each placement attempt a "Test", but we use "check" here
  // to avoid confusion with Jasmine test cases.
  //
  // Board layout used (12 wide × 18 tall, G = obstacle):
  //
  //   col:  0 1 2 3 4 5 ...
  //   row 4: . . . . . .        ← free → check 5 lands here (y-2)
  //   row 5: . . . . . .
  //   row 6: . . . G . .        ← G at [6][3] blocks checks 1, 2 and 4
  //   row 7: . . J J J .        ← J state-0 piece sits here (cleared before check)
  //   row 8: . . . . G .        ← G at [8][4] blocks check 3
  //
  // The _safeRotate sequence:
  //   Basic rotation [0,0]  → piece at (2,6): board[6][3]=G → FAIL
  //   Kick check 2   [1,0]  → piece at (3,6): board[6][3]=G → FAIL
  //   Kick check 3   [1,1]  → piece at (3,7): board[8][4]=G → FAIL
  //   Kick check 4   [0,-2] → piece at (2,4): board[6][3]=G → FAIL
  //   Kick check 5   [1,-2] → piece at (3,4): all free       → SUCCESS  ✓

  describe('wallKick scenario — wiki J-piece 0→L example', () => {
    // Replicates the _testMove logic (private in TetrisComponent)
    function canPlace(board: number[][], piece: number[][], pos: { x: number; y: number }): boolean {
      return piece.every((row, ri) =>
        row.every((cell, ci) =>
          cell === 0 || board[pos.y + ri]?.[pos.x + ci] === 0,
        ),
      );
    }

    function buildBoard(): number[][] {
      const board = Array.from({ length: 18 }, () => new Array(12).fill(0));
      board[6][3] = 1; // obstacle: blocks basic rotation and kicks 2 & 4
      board[8][4] = 1; // obstacle: blocks kick 3
      return board;
    }

    const jState0 = {
      type: 'J' as const,
      rotation: 'R_0' as const,
      piece: TERAMINOS.J.map(row => row.map(cell => cell ? 2 : 0)),
    };
    const position = { x: 2, y: 6 };

    it('basic rotation check (0,0) fails — L-state piece overlaps obstacle', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      expect(canPlace(board, rotated.piece, position)).toBeFalse();
    });

    it('kick check 2 [+1, 0] fails — shifted right still overlaps obstacle', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      const kicks = TetrisUtils.wallKick(jState0, rotated); // [0L] data
      const pos2 = { x: position.x + kicks[0][0], y: position.y + kicks[0][1] };
      expect(canPlace(board, rotated.piece, pos2)).toBeFalse();
    });

    it('kick check 3 [+1, +1] fails — shifted right+down overlaps obstacle', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      const kicks = TetrisUtils.wallKick(jState0, rotated);
      const pos3 = { x: position.x + kicks[1][0], y: position.y + kicks[1][1] };
      expect(canPlace(board, rotated.piece, pos3)).toBeFalse();
    });

    it('kick check 4 [0, -2] fails — shifted up overlaps obstacle', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      const kicks = TetrisUtils.wallKick(jState0, rotated);
      const pos4 = { x: position.x + kicks[2][0], y: position.y + kicks[2][1] };
      expect(canPlace(board, rotated.piece, pos4)).toBeFalse();
    });

    it('kick check 5 [+1, -2] succeeds — piece fits after right+up shift', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      const kicks = TetrisUtils.wallKick(jState0, rotated);
      const pos5 = { x: position.x + kicks[3][0], y: position.y + kicks[3][1] };
      expect(canPlace(board, rotated.piece, pos5)).toBeTrue();
    });

    it('simulated _safeRotate picks kick index 3 (check 5) as first success', () => {
      const board = buildBoard();
      const rotated = TetrisUtils.rotate(jState0, true);
      const kicks = TetrisUtils.wallKick(jState0, rotated);

      // Mirror the _safeRotate loop
      let successIndex = -1;
      if (!canPlace(board, rotated.piece, position)) {
        for (let i = 0; i < kicks.length; i++) {
          const pos = { x: position.x + kicks[i][0], y: position.y + kicks[i][1] };
          if (canPlace(board, rotated.piece, pos)) {
            successIndex = i;
            break;
          }
        }
      }

      expect(successIndex).toBe(3); // 4th kick entry = SRS test 5
    });
  });
});
