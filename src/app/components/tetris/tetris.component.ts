import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { delay, Observable, of, repeat, Subscription } from 'rxjs';
import { Coords, GameStates, Moves, Teramino } from '../../models/game.model';
import { GameStateService } from '../../services/game-state.service';
import { SoundsService } from '../../services/sounds.service';
import { TETRIS } from 'src/app/models/contants.model';
import { TetrisUtils } from './tetris-utils';
import { InputsService } from 'src/app/services/inputs.service';

@Component({
    selector: 'app-tetris',
    templateUrl: './tetris.component.html',
    styleUrls: ['./tetris.component.scss'],
    standalone: false,
})
export class TetrisComponent implements OnInit, OnDestroy {
  protected board!: number[][];
  protected nextPiece!: Teramino;
  protected onScreenMessage$: Observable<string | null> =
    this.game.stateMessages$;

  private _currentPiece!: Teramino;
  private _position: Coords = { x: 0, y: 0 };
  private _countNoCollision = 0;
  private _timeMoveSub!: Subscription;

  // Mappa delle azioni speciali e delle mosse
  private _actions = {
    "__p": () => this._togglePause(),
    ...Object.values(Moves).reduce((acc, move) => {
      acc[move] = () => this._move(move as Moves);
      return acc;
    }, {} as { [key in Moves]: () => void }),
  };

  constructor(
    private game: GameStateService,
    private sound: SoundsService,
    private input: InputsService,
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent): void {
    const action = this.input.keyboardEventToAction(e);

    if (action && action in this._actions) 
      this._actions[action]();  
  }

  ngOnInit(): void {
    this._initBoard();
    this.nextPiece = TetrisUtils.getRandomPiece();
  }

  startGame(): void {
    this._stopTime();
    this.game.state = GameStates.INGAME;
    this._initBoard();
    this._placePiece();
    this._startTime();
  }

  private _initBoard(): void {
    this.board =
      new Array<number[]>(TETRIS.BOARD_SIZE.y)
        .fill([]).map(() =>
          new Array<number>(TETRIS.BOARD_SIZE.x)
            .fill(TETRIS.EMPTY_BLOCK));
  }

  private _placePiece(): void {
    this._currentPiece = this.nextPiece;
    this.nextPiece = TetrisUtils.getRandomPiece();

    this._position.y = 0;
    this._position.x = (this.board[this._position.y].length / 2)
      - Math.round(this._currentPiece.piece[this._position.y].length / 2);

    this._currentPiece.piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > 0)
          this.board[ri][this._position.x + ci] = c;
      }));
    this._countNoCollision = 0;
  }

  private _move(action: Moves): void {
    if (this.game.state !== GameStates.INGAME) return;

    this._clearPrevMove();
    const newPos = { ...this._position };

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
      case Moves.ROTATE_L:
        this._safeRotate();
        break;
      case Moves.ROTATE_R:
        this._safeRotate(true);
        break;
      case Moves.SCROLL:
        this._scrollDown(newPos);
        break;
    }

    const canMove = this._testMove(this._currentPiece.piece, newPos);

    if (canMove) {
      canMove.move.forEach(m =>
        this.board[m.y][m.x] = canMove.color);
      this._position = { ...newPos };
    } else {
      this._confirmMove();
      if (action === Moves.DOWN) {
        if (this._countNoCollision <= 1)
          this._setGameOver();
        else {
          this.sound.brick();
          this._verifyWall();
          this._placePiece();
        }
      }
    }
    this._countNoCollision++;
  }

  private _testMove(piece: number[][], newPos: Coords): { move: Coords[], color: number } | false {
    const move: Coords[] = [];
    let permitted = true;
    let color: number = TETRIS.EMPTY_BLOCK;

    piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > TETRIS.EMPTY_BLOCK && permitted)
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
    this._currentPiece.piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > TETRIS.EMPTY_BLOCK)
          this.board[this._position.y + ri][this._position.x + ci] = c;
      }));
  }

  private _clearPrevMove(): void {
    this._currentPiece.piece.forEach((r, ri) =>
      r.forEach((c, ci) => {
        if (c > TETRIS.EMPTY_BLOCK)
          this.board[this._position.y + ri][this._position.x + ci] = TETRIS.EMPTY_BLOCK;
      }));
  }

  private _safeRotate(toLeft?: true): void {
    const rotated: Teramino = 
      TetrisUtils.rotate(this._currentPiece, toLeft);
    
    if (this._testMove(rotated.piece, this._position)) {
      this._currentPiece = rotated;
      this.sound.rotate();
    } else {
      for (const coord of TetrisUtils.wallKick(this._currentPiece, rotated)) {
        const wallKickPos = {
          x: this._position.x + coord[0],
          y: this._position.y + coord[1],
        };

        if (this._testMove(rotated.piece, wallKickPos)) {
          this._position = wallKickPos;
          this._currentPiece = rotated;
          this.sound.rotate();
          break;
        }
      }
    }
  }

  private _scrollDown(position: Coords): void {
    while (this._testMove(this._currentPiece.piece, position)) {
      position.y++;
      this._countNoCollision++;
    }
    position.y--;
    this.sound.scroll();
  }

  private _verifyWall(): void {
    this.board.forEach((r, ri) => {
      if (!r.includes(TETRIS.EMPTY_BLOCK)) {
        this.board.splice(ri, 1);
        this.board.unshift(new Array<number>(TETRIS.BOARD_SIZE.x)
          .fill(TETRIS.EMPTY_BLOCK));
      }
    })
  }

  private _startTime(): void {
    this._timeMoveSub =
      of(Moves.DOWN).pipe(
        delay(this.game.delay),
        repeat()
      ).subscribe({
        next: m =>
          this._move(m),
        error: e =>
          console.error(e),
      });
  }

  private _stopTime(): void {
    this._timeMoveSub?.unsubscribe();
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
    this._timeMoveSub.unsubscribe();
  }
}
