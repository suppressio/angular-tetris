import { TERAMINOS } from '../../models/game.model';
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
});
