import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { TETRIS } from '../models/contants.model';
import { TetrisUtils } from '../components/tetris/tetris-utils';

@Injectable()
export class SoundsService {
  private readonly _basePath = 'assets/audio/';
  private readonly _effectsPath = 'effects/';
  private readonly _musicPath = 'music/';

  private _enabled: boolean = env.sounds;
  private _volumeEffects: number = env.volume_effects;
  private _volumeMusic: number = env.volume_music;

  get enabled(): boolean { return this._enabled; }
  set enabled(v: boolean) { this._enabled = v; }

  set volume_effects(v: number) {
    this._volumeEffects = this._safeVolume(v);
  }

  get volume_effects(): number {
    return this._volumeEffects;
  }

  set volume_music(v: number) {
    this._volumeMusic = this._safeVolume(v);
  }

  get volume_music(): number {
    return this._volumeMusic;
  }

  pause = (paused: boolean) =>
    this._getSound(
      this._getPathFileName(TETRIS.SOUNDS.PAUSE, paused ? 1 : 2),
      this.volume_effects,
    )?.play();

  rotate = () => this._whoosh();
  scroll = () => this._whoosh();

  brick = () =>
    this._getSound(
      this._getPathFileName(TETRIS.SOUNDS.BRICK, TetrisUtils.rnd(1, 6)),
      this.volume_effects,
    )?.play();

  music = () =>
    this._getSound(
      `${this._basePath}${this._musicPath}${TETRIS.SOUNDS.MUSIC}`,
      this.volume_music,
    )?.play();

  private _whoosh = () =>
    this._getSound(
      this._getPathFileName(TETRIS.SOUNDS.ROTATE, TetrisUtils.rnd(1, 7)),
      this.volume_effects,
    )?.play();

  private _getPathFileName = (base: string, idx: number): string =>
    `${this._basePath}${this._effectsPath}${base.replace('#', idx.toString())}`;

  private _getSound(path: string, volume?: number): HTMLAudioElement | null {
    if (!this._enabled) return null;
    let sound: HTMLAudioElement | null = new Audio();
    sound.src = path;
    sound.load();
    sound.volume = volume ?? 1;
    sound.onended = () => {
      sound = null;
    };
    return sound;
  }

  private _safeVolume = (v: number): number =>
    v >= 0 && v <= 1 ? v : TETRIS.DEFAULT_VOLUME;
}