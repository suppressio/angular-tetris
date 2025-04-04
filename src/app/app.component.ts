import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { delay, map, Observable, of, repeat, Subscription } from 'rxjs';
import { Coords, GameStates, Moves, TERAMINOS, TeraminoKeys, Rotations, Teramino, WALL_KICK_I, WALL_KICK_JLSTZ, RotationsKeys, WallKick } from './models/game.model';
import { GameStateService } from './services/game-state.service';
import { SoundsService } from './services/sounds.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly EMPTY = 0;

  private readonly BOARD_SIZE = { x: 12, y: 18 };
  protected board!: number[][];

  private readonly DEFAULT_DELAY: number = 800;

  protected nextPiece!: Teramino;
  private currentPiece!: Teramino;
  private position: Coords = { x: 0, y: 0 };

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
    private game: GameStateService,
    private sound: SoundsService,
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        this._move(Moves.DOWN)
        break;
      case "ArrowUp":
        this._move(Moves.SCROLL)
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
    this._stopTime();
    this.game.state = GameStates.INGAME;
    this._initBoard();
    this._place();
    this._startTime();
  }

  private _initBoard(): void {
    this.board =
      new Array<Array<number>>(this.BOARD_SIZE.y)
        .fill([]).map(() =>
          new Array<number>(this.BOARD_SIZE.x)
            .fill(this.EMPTY));
  }

  private _getRandomPiece(): Teramino {
    /** Random number from min to max (min and max included) */
    const __randomIntFromInterval = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const keys: TeraminoKeys[] = Object.keys(TERAMINOS) as TeraminoKeys[];
    const randomIndex: number = __randomIntFromInterval(0, keys.length - 1);
    const color: number = randomIndex + 1; // To use random color: __randomIntFromInterval(1, 7);
    return {
      piece: TERAMINOS[keys[randomIndex]].map(y => y.map(x => x ? color : this.EMPTY)),
      type: keys[randomIndex],
      rotation: Object.keys(Rotations)[Rotations.R_0] as RotationsKeys,
    };
  }

  private _place(): void {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this._getRandomPiece();

    this.position.y = 0;
    this.position.x = (this.board[this.position.y].length / 2)
      - Math.round(this.currentPiece.piece[this.position.y].length / 2);

    this.currentPiece.piece.forEach((r, ri) =>
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
      case Moves.LEFT:
        newPos.x--;
        break;
      case Moves.RIGHT:
        newPos.x++;
        break;
      case Moves.ROTATE:
        this._safeRotate();
        break;
      case Moves.SCROLL:
        this._scrollDown(newPos);
        break;
    }

    const canMove = this._testMove(this.currentPiece.piece, newPos);

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
          this.sound.brick();
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
    let color = this.EMPTY;

    piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > this.EMPTY && permitted)
          if (
            this.board[newPos.y + ri]
            ?.[newPos.x + ci] === 0
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
    this.currentPiece.piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > this.EMPTY)
          this.board[this.position.y + ri][this.position.x + ci] = c;
      }));
  }

  private _clearPrevMove(): void {
    this.currentPiece.piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > this.EMPTY)
          this.board[this.position.y + ri][this.position.x + ci] = this.EMPTY;
      }));
  }

  private _safeRotate(toLeft?: true): void {
    function __rotate(t: Teramino): Teramino {
      const numRows = t.piece.length;
      const numCols = t.piece[0].length;

      const rotatedPiece: number[][] =
        Array.from({ length: numCols }, () =>
          Array(numRows).fill(false));

      for (let row = 0; row < numRows; row++)
        for (let col = 0; col < numCols; col++)
          rotatedPiece[col][numRows - 1 - row] =
            t.piece[row][col];

      const idx = Object.keys(Rotations).indexOf(t.rotation);

      return {
        ...t,
        piece: rotatedPiece,
        rotation: Object.keys(Rotations)[(idx + (toLeft ? -1 : 1)) % 4] as RotationsKeys,
      };
    }

    const __getWallKickKey = (
      from: RotationsKeys,
      to: RotationsKeys
    ): keyof WallKick =>
      `${Rotations[from]}${Rotations[to]}` as keyof WallKick;

    function __wallKick(currentPiece: Teramino, rotated: Teramino): number[][] {
      switch (rotated.type) {
        case 'J':
        case 'L':
        case 'S':
        case 'T':
        case 'Z':
          return WALL_KICK_JLSTZ[
            __getWallKickKey(currentPiece.rotation, rotated.rotation)];
        case 'I':
          return WALL_KICK_I[
            __getWallKickKey(currentPiece.rotation, rotated.rotation)];
        default:
          return [];
      }
    }

    const rotated: Teramino = __rotate(this.currentPiece);
    if (this._testMove(rotated.piece, this.position)) {
      this.currentPiece = rotated;
      this.sound.rotate();
    } else {
      for (const coord of __wallKick(this.currentPiece, rotated)) {
        const wallKickPos = {
          x: this.position.x + coord[0],
          y: this.position.y + coord[1],
        };

        if (this._testMove(rotated.piece, wallKickPos)) {
          this.position = wallKickPos;
          this.currentPiece = rotated;
          this.sound.rotate();
          break;
        }
      }
    }
  }

  private _scrollDown(position: Coords): void {
    while (this._testMove(this.currentPiece.piece, position)) {
      position.y++;
      this.countNoCollision++;
    }
    position.y--;
    this.sound.scroll();
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

  private _startTime(): void {
    this.timeMoveSub =
      of(Moves.DOWN).pipe(
        delay(this.DEFAULT_DELAY),
        repeat()
      ).subscribe(m =>
        this._move(m));
  }

  private _stopTime(): void {
    this.timeMoveSub?.unsubscribe();
  }

  private _setGameOver(): void {
    this.game.state = GameStates.GAMEOVER;
    this._stopTime();
  }

  private _togglePause(): void {
    switch (this.game.state) {
      case GameStates.INGAME:
        this.game.state = GameStates.PAUSE;
        this._stopTime();
        this.sound.pause(true);
        break;
      case GameStates.PAUSE:
        this.game.state = GameStates.INGAME;
        this._startTime();
        this.sound.pause(false);
    }
  }

  ngOnDestroy(): void {
    this.timeMoveSub.unsubscribe();
  }
}
