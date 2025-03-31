import { Injectable } from "@angular/core";
import { Moves } from "../models/game.model";

@Injectable()
export class InputsService {

    keyboardEventToAction(event: KeyboardEvent): 
        | Moves.DOWN 
        | Moves.LEFT 
        | Moves.RIGHT 
        | Moves.ROTATE_L 
        | Moves.SCROLL 
        | "__p" 
        | undefined {
        switch (event.key) {
            case "ArrowDown":
                return Moves.DOWN;
            case "ArrowUp":
                return Moves.SCROLL;
            case "ArrowLeft":
                return Moves.LEFT;
            case "ArrowRight":
                return Moves.RIGHT;
            case " ":
                return Moves.ROTATE_L;

            case "p":
            case "P":
            case "Pause":
                return "__p";
            default:
                return;
        }
    }

}