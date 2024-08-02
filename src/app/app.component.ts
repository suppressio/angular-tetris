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
  DOWN = "d",
  UP = "u",
  LEFT = "l",
  RIGHT = "r",
  ROTATE = "t",
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

  private readonly EMPTY = 0;

  private readonly BOARD_SIZE = { x: 16, y: 28 }

  protected board!: number[][]

  private delay!: number;

  protected nextPiece!: number[][];
  private currentPiece!: number[][];
  private position: { x: number, y: number } = {x:0,y:0};

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
        .fill([])
        .map(e => 
          new Array<number>(this.BOARD_SIZE.x)
            .fill(this.EMPTY));
  }

  randomPiece(): number[][] {
    const randomColor = randomIntFromInterval(1, 5);
    const keys = Object.keys(PIECES) as PiecesIdx[];
    const randomIndex = randomIntFromInterval(0, keys.length - 1);
    return PIECES[keys[randomIndex]].map(y => y.map(x => x ? randomColor : 0));
  }

  place(): void {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.randomPiece();
    console.log({currentPiece: this.currentPiece, nextPiece: this.nextPiece}, {board: this.board});

    this.position.y = 0;
    this.position.x = (this.board[this.position.y].length / 2) 
      - Math.round(this.currentPiece[this.position.y].length / 2);

    this.currentPiece.forEach((r, ri) => r.forEach((c,ci) => {
      if (c >= 0)
        this.board[ri][this.position.x + ci] = c;
    }));
  }

  move(action: Moves): void {
    console.log("move: ", action, {x: this.position.x , y: this.position.y});
    this.clearPieceOnBoard();

    switch (action) {
      case Moves.DOWN :
        if (this.position.y < (this.BOARD_SIZE.y - this.currentPiece[0].length -1))
          this.position.y++;
        break;
      case Moves.UP :
        // if (this.position.y < this.BOARD_SIZE.)
        //   this.position.y = this.position.y++;
        break;
      case Moves.LEFT :
        if (this.position.x > 0)
          this.position.x--;
        break;
      case Moves.RIGHT :
        if (this.position.x < (this.BOARD_SIZE.x - this.currentPiece.length - 1))
          this.position.x++;
        break;
      case Moves.ROTATE:
        this.currentPiece = this.rotate(this.currentPiece) ;
    }


    this.currentPiece.forEach((r, ri) => 
      r.forEach((c,ci) => {
        if (c >= 0)
          this.board[this.position.y + ri][this.position.x + ci] = c
    })); 
  }

  private clearPieceOnBoard(): void {
    this.currentPiece.forEach((r, ri) => 
      r.forEach((c,ci) => {
        if (c > 0)
          this.board[this.position.y + ri][this.position.x + ci ] = 0;
    })); 
  }

  private rotate(piece: number[][]): number[][] {
    const numRows = piece.length;
    const numCols = piece[0].length;
  
    const rotatedMatrix: number[][] = Array.from({ length: numCols }, () => Array(numRows).fill(false));
  
    for (let row = 0; row < numRows; row++) 
      for (let col = 0; col < numCols; col++) 
        rotatedMatrix[col][numRows - 1 - row] = piece[row][col];
  
    return rotatedMatrix;
  }

  verifyWall(): void { }

  timeMove(): void { }
}
