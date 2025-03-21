import { Injectable } from "@angular/core";
import { GameStates } from "../models/game.model";
import { BehaviorSubject, Observable } from "rxjs";
import { environment as env } from "src/environments/environment";

@Injectable()
export class GameStateService {

  private _state: GameStates = GameStates.NOGAME;
  private _state$ = new BehaviorSubject<GameStates>(this._state);

  private readonly DEFAULT_VOLUME = 0.8;

  private _volume_effects: number = env.volume_effects;
  private _volume_music: number = env.volume_music;

  set state(newState: GameStates) {
    this._state = newState;
    this._state$.next(this._state);
  }

  get state(): GameStates {
    return this._state;
  }

  get state$(): Observable<GameStates> {
    return this._state$.asObservable();
  }

  set volume_effects(v: number) {
    this._volume_effects = this._safeVolume(v);
  }

  get volume_effects(): number {
    return this._volume_effects;
  }

  set volume_music(v: number) {
    this._volume_music = this._safeVolume(v);
  }

  get volume_music(): number {
    return this._volume_music;
  }

  private _safeVolume = (v: number): number =>
    (v >= 0 && v <= 1) ? v : this.DEFAULT_VOLUME;
}