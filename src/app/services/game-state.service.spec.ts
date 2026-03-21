import { fakeAsync, tick } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { GameStates } from '../models/game.model';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => { service = new GameStateService(); });

  // ─── initial state ────────────────────────────────────────────────────────

  it('starts in NOGAME state', () => {
    expect(service.state).toBe(GameStates.NOGAME);
  });

  // ─── state transitions ────────────────────────────────────────────────────

  it('transitions to INGAME', () => {
    service.state = GameStates.INGAME;
    expect(service.state).toBe(GameStates.INGAME);
  });

  it('transitions to PAUSE', () => {
    service.state = GameStates.PAUSE;
    expect(service.state).toBe(GameStates.PAUSE);
  });

  it('transitions to GAMEOVER', () => {
    service.state = GameStates.GAMEOVER;
    expect(service.state).toBe(GameStates.GAMEOVER);
  });

  // ─── stateMessages$ ───────────────────────────────────────────────────────

  it('emits null for NOGAME', fakeAsync(() => {
    let emitted: string | null | undefined;
    service.stateMessages$.subscribe(v => emitted = v);
    tick();
    expect(emitted).toBeNull();
  }));

  it('emits null for INGAME', fakeAsync(() => {
    let emitted: string | null | undefined;
    service.stateMessages$.subscribe(v => emitted = v);
    service.state = GameStates.INGAME;
    tick();
    expect(emitted).toBeNull();
  }));

  it('emits "Pause" when state is PAUSE', fakeAsync(() => {
    let emitted: string | null | undefined;
    service.stateMessages$.subscribe(v => emitted = v);
    service.state = GameStates.PAUSE;
    tick();
    expect(emitted).toBe('Pause');
  }));

  it('emits "Game Over" when state is GAMEOVER', fakeAsync(() => {
    let emitted: string | null | undefined;
    service.stateMessages$.subscribe(v => emitted = v);
    service.state = GameStates.GAMEOVER;
    tick();
    expect(emitted).toBe('Game Over');
  }));

  it('emits null again after returning to INGAME from PAUSE', fakeAsync(() => {
    const emissions: (string | null)[] = [];
    service.stateMessages$.subscribe(v => emissions.push(v));
    service.state = GameStates.PAUSE;
    service.state = GameStates.INGAME;
    tick();
    expect(emissions[emissions.length - 1]).toBeNull();
  }));
});
