import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { delay, map, Observable, of, repeat, Subscription } from 'rxjs';
import { Coords, GameStates, Moves, PIECES, PiecesIdx } from './models/game.model';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly EMPTY = 0;

  private readonly BOARD_SIZE = { x: 12, y: 18 };
  protected board!: number[][];

  private readonly DEFAULT_DELAY: number = 800;

  protected nextPiece!: number[][];
  private currentPiece!: number[][];
  private position: Coords =
    { x: 0, y: 0 };

  private timeMoveSub!: Subscription;

  private countNoCollision: number = 0;

  protected onScreenMessage$: Observable<string | null> =
    this.game.state$.pipe(map(s => {
      switch (s) {
        case GameStates.GAMEOVER:
          return "GameOver"
        case GameStates.PAUSE:
          return "Pause"
        default: return null;
      }
    }));

  constructor(
    private game: GameStateService
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        this._move(Moves.DOWN)
        break;
      case "ArrowUp":
        this._move(Moves.UP)
        break;
      case "ArrowLeft":
        this._move(Moves.LEFT)
        break;
      case "ArrowRight":
        this._move(Moves.RIGHT)
        break;
      case " ":
        this._move(Moves.ROTATE)
        break;
      case "p":
      case "P":
      case "Pause":
        this._togglePause();
        break;
    }
  }

  ngOnInit(): void {
    this._initBoard();
    this.nextPiece = this._getRandomPiece();
  }

  startGame(): void {
    this._stopTimeMove();
    this.game.state = GameStates.INGAME;
    this._initBoard();
    this._place();
    this._timeMove();
  }

  private _initBoard(): void {
    this.board =
      new Array<Array<number>>(this.BOARD_SIZE.y)
        .fill([]).map(() =>
          new Array<number>(this.BOARD_SIZE.x)
            .fill(this.EMPTY));
  }

  private _getRandomPiece(): number[][] {
    /** Random number from min to max (min and max included) */
    const __randomIntFromInterval = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const keys = Object.keys(PIECES) as PiecesIdx[];
    const randomIndex = __randomIntFromInterval(0, keys.length - 1);
    const randomColor = __randomIntFromInterval(1, 5);
    return PIECES[keys[randomIndex]].map(y => y.map(x => x ? randomColor : 0));
  }

  private _place(): void {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this._getRandomPiece();

    this.position.y = 0;
    this.position.x = (this.board[this.position.y].length / 2)
      - Math.round(this.currentPiece[this.position.y].length / 2);

    this.currentPiece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > 0)
          this.board[ri][this.position.x + ci] = c;
      }));
    this.countNoCollision = 0;
  }

  private _move(action: Moves): void {
    if (this.game.state !== GameStates.INGAME) return;

    this._clearPrevMove();
    const newPos = { ...this.position };

    switch (action) {
      case Moves.DOWN:
        newPos.y++;
        break;
      case Moves.UP:
        this._scrollDown(newPos);
        break;
      case Moves.LEFT:
        newPos.x--;
        break;
      case Moves.RIGHT:
        newPos.x++;
        break;
      case Moves.ROTATE:
        this._safeRotate();
        break;
    }

    const canMove = this._testMove(this.currentPiece, newPos);

    if (canMove) {
      canMove.move.forEach(m =>
        this.board[m.y][m.x] = canMove.color);
      this.position = { ...newPos };
    } else {
      this._confirmMove();
      if (action === Moves.DOWN) {
        if (this.countNoCollision <= 1)
          this._setGameOver();
        else {
          this._verifyWall();
          this._place();
        }
      }
    }
    this.countNoCollision++;
  }

  private _testMove(piece: number[][], newPos: Coords): { move: Coords[], color: number } | false {
    const move: Coords[] = [];
    let permitted = true;
    let color = 0;

    piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > 0 && permitted)
          if (
            this.board[newPos.y + ri]
            && this.board[newPos.y + ri][newPos.x + ci] === 0
          ) {
            move.push({
              x: newPos.x + ci,
              y: newPos.y + ri,
            });
            color = c;
          } else
            permitted = false;
      }));

    return permitted ? { move, color } : false;
  }

  private _confirmMove(): void {
    this.currentPiece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > 0)
          this.board[this.position.y + ri][this.position.x + ci] = c;
      }));
  }

  private _clearPrevMove(): void {
    this.currentPiece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > 0)
          this.board[this.position.y + ri][this.position.x + ci] = this.EMPTY;
      }));
  }

  private _safeRotate(): void {
    function __rotate(piece: number[][]): number[][] {
      const numRows = piece.length;
      const numCols = piece[0].length;

      const rotatedPiece: number[][] =
        Array.from({ length: numCols }, () =>
          Array(numRows).fill(false));

      for (let row = 0; row < numRows; row++)
        for (let col = 0; col < numCols; col++)
          rotatedPiece[col][numRows - 1 - row] =
            piece[row][col];

      return rotatedPiece;
    }

    let rotate: number[][] = __rotate(this.currentPiece);
    while (this._testMove(rotate, this.position) === false)
      rotate = __rotate(rotate);

    this.currentPiece = rotate;
  }

  private _scrollDown(position: Coords): void {
    while (this._testMove(this.currentPiece, position)) {
      position.y++;
      this.countNoCollision++;
    }
    position.y--;
  }

  private _verifyWall(): void {
    this.board.forEach((r, ri) => {
      if (!r.includes(this.EMPTY)) {
        this.board.splice(ri, 1);
        this.board.unshift(new Array<number>(this.BOARD_SIZE.x)
          .fill(this.EMPTY));
      }
    })
  }

  private _timeMove(): void {
    this.timeMoveSub =
      of(Moves.DOWN).pipe(
        delay(this.DEFAULT_DELAY),
        repeat()
      ).subscribe(m =>
        this._move(m));
  }

  private _stopTimeMove(): void {
    if (this.timeMoveSub)
      this.timeMoveSub.unsubscribe();
  }

  private _setGameOver(): void {
    this.game.state = GameStates.GAMEOVER;
    this._stopTimeMove();
  }

  private _togglePause(): void {
    switch (this.game.state) {
      case GameStates.INGAME:
        this.game.state = GameStates.PAUSE;
        this._stopTimeMove();
        break;
      case GameStates.PAUSE:
        this.game.state = GameStates.INGAME;
        this._timeMove();
    }
  }

  ngOnDestroy(): void {
    this.timeMoveSub.unsubscribe();
  }
}
