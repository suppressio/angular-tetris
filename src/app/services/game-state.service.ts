import { Injectable } from "@angular/core";
import { GameStates } from "../models/game.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class GameStateService{

  private _state: GameStates = GameStates.NOGAME;
  private _state$ = new BehaviorSubject<GameStates>(this._state);


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
}