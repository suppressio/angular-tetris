import { InputsService } from './inputs.service';
import { Moves } from '../models/game.model';

describe('InputsService', () => {
  let service: InputsService;

  beforeEach(() => { service = new InputsService(); });

  const key = (k: string): KeyboardEvent =>
    new KeyboardEvent('keydown', { key: k });

  it('ArrowDown → Moves.DOWN', () => {
    expect(service.keyboardEventToAction(key('ArrowDown'))).toBe(Moves.DOWN);
  });

  it('ArrowUp → Moves.SCROLL', () => {
    expect(service.keyboardEventToAction(key('ArrowUp'))).toBe(Moves.SCROLL);
  });

  it('ArrowLeft → Moves.LEFT', () => {
    expect(service.keyboardEventToAction(key('ArrowLeft'))).toBe(Moves.LEFT);
  });

  it('ArrowRight → Moves.RIGHT', () => {
    expect(service.keyboardEventToAction(key('ArrowRight'))).toBe(Moves.RIGHT);
  });

  it('Space → Moves.ROTATE_L', () => {
    expect(service.keyboardEventToAction(key(' '))).toBe(Moves.ROTATE_L);
  });

  it('p → pause action "__p"', () => {
    expect(service.keyboardEventToAction(key('p'))).toBe('__p');
  });

  it('P (uppercase) → pause action "__p"', () => {
    expect(service.keyboardEventToAction(key('P'))).toBe('__p');
  });

  it('Pause key → pause action "__p"', () => {
    expect(service.keyboardEventToAction(key('Pause'))).toBe('__p');
  });

  it('z → Moves.ROTATE_R', () => {
    expect(service.keyboardEventToAction(key('z'))).toBe(Moves.ROTATE_R);
  });

  it('Z (uppercase) → Moves.ROTATE_R', () => {
    expect(service.keyboardEventToAction(key('Z'))).toBe(Moves.ROTATE_R);
  });

  it('unrecognised key → undefined', () => {
    expect(service.keyboardEventToAction(key('Enter'))).toBeUndefined();
    expect(service.keyboardEventToAction(key('a'))).toBeUndefined();
    expect(service.keyboardEventToAction(key('Tab'))).toBeUndefined();
  });
});
