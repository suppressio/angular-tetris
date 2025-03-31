import { Injectable } from "@angular/core";
import { environment as env } from "src/environments/environment";
import { TETRIS } from "../models/contants.model";
import { TetrisUtils } from "../components/tetris/tetris-utils";

@Injectable()
export class SoundsService {
    private readonly _base_path = "assets/audio/";
    private readonly _effects_path = "effects/";
    private readonly _music_path = "music/";

    private _volume_effects: number = env.volume_effects;
    private _volume_music: number = env.volume_music;

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

    pause = (b: boolean) =>
        this._getSound(
            this._getPathFileName(
                TETRIS.SOUNDS.PAUSE,
                b ? 1 : 2),
            this.volume_effects
        )?.play();

    rotate = () => this._whoosh();
    scroll = () => this._whoosh();

    brick = () =>
        this._getSound(
            this._getPathFileName(
                TETRIS.SOUNDS.BRICK,
                TetrisUtils.rnd(1, 6)),
            this.volume_effects
        )?.play();

    music = () =>
        this._getSound(
            `${this._base_path}${this._music_path}${TETRIS.SOUNDS.MUSIC}`,
            this.volume_music
        )?.play();

    private _whoosh = () =>
        this._getSound(
            this._getPathFileName(
                TETRIS.SOUNDS.ROTATE,
                TetrisUtils.rnd(1, 7)),
            this.volume_effects
        )?.play();

    private _getPathFileName = (base: string, idx: number): string =>
        `${this._base_path}${this._effects_path}${base.replace('#', idx.toString())}`;

    private _getSound(path: string, volume?: number): HTMLAudioElement | null {
        if (!env.sounds) return null;
        let s: HTMLAudioElement | null = new Audio();
        s.src = path;
        s.load();
        s.volume = volume ? volume : 1;
        s.onended = () => s = null;
        return s;
    }

    private _safeVolume = (v: number): number =>
        (v >= 0 && v <= 1) ? v : TETRIS.DEFAULT_VOLUME;
}
