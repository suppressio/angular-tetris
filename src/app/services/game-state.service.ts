import { Injectable } from "@angular/core";
import { GameStates } from "../models/game.model";
import { BehaviorSubject, map, Observable } from "rxjs";
import { TETRIS } from "../models/contants.model";

@Injectable()
export class GameStateService {

  private _state: GameStates = GameStates.NOGAME;
  private _state$ = new BehaviorSubject<GameStates>(this._state);

  private _delay: number = TETRIS.DEFAULT_DELAY;

  set state(newState: GameStates) {
    this._state = newState;
    this._state$.next(this._state);
  }

  get state(): GameStates {
    return this._state;
  }

  stateMessages$: Observable<string | null> =
    this._state$.pipe(map(s => {
      switch (s) {
        case GameStates.GAMEOVER:
          return "Game Over"
        case GameStates.PAUSE:
          return "Pause"
        default: return null;
      }
    }));

  set delay(d: number) {
    this._delay = d;
  }

  get delay(): number {
    return this._delay;
  }
}