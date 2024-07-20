import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

const PIECES = {
  I: [[true, true, true, true]],
  L: [[true, false, false], [true, true, true]],
  L2: [[false, false, true], [true, true, true]],
  Q: [[true, true], [true, true]],
  S: [[true, true, false], [false, true, true]],
  S2: [[false, true, true], [true, true, false]],
  A: [[false, true, false], [true, true, true]],
}

type PiecesIdx = keyof typeof PIECES;

enum Moves {
  DOWN,
  UP,
  LEFT,
  RIGHT,
  ROTATE,
}

/** Random number from min to max (min and max included) */
function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly BOARD_SIZE = { x: 16, y: 28 }

  protected board!: number[][]

  private delay!: number;

  protected nextPiece!: number[][];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        this.move(Moves.DOWN)
        break;
      case "ArrowUp":
        this.move(Moves.UP)
        break;
      case "ArrowLeft":
        this.move(Moves.LEFT)
        break;
      case "ArrowRight":
        this.move(Moves.RIGHT)
        break;
      case " ":
        this.move(Moves.ROTATE)
        break;
    }
  }

  ngOnInit(): void {
    this.initBoard();
    this.nextPiece = this.randomPiece();
    this.place();
  }

  initBoard(): void {
    this.board =
      new Array<Array<number>>(this.BOARD_SIZE.y)
        .fill(new Array<number>(this.BOARD_SIZE.x).fill(0));
  }

  randomPiece(): number[][] {
    const randomColor = randomIntFromInterval(1, 5);
    const keys = Object.keys(PIECES) as PiecesIdx[];
    const randomIndex = randomIntFromInterval(0, keys.length - 1);
    return PIECES[keys[randomIndex]].map(y => y.map(x => x ? randomColor : 0));
  }

  place(): void {
    const newPiece = this.nextPiece;
    this.nextPiece = this.randomPiece();
    console.log({newPiece, nextPiece: this.nextPiece});
  }

  move(action: Moves): void {
    console.log("move: ", action);
  }

  verifyWall(): void { }

  timeMove(): void { }
}
