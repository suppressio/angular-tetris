import { Injectable } from "@angular/core";
import { GameStateService } from "./game-state.service";
import { environment as env } from "src/environments/environment";

@Injectable()
export class SoundsService {
    private _base_path: string = "assets/audio/";
    private _effects_path: string = "effects/";
    private _music_path: string = "music/";
    private _pause_sound: string = "pause#.mp3";
    private _brick_sound: string = "brick#.mp3";
    private _rotate_sound: string = "whoosh#.mp3";

    constructor(
        private game: GameStateService,
    ) { }

    pause = (b: boolean) =>
        this._getSound(
            this._getPathFileName(
                this._pause_sound,
                b ? 1 : 2),
            this.game.volume_effects
        )?.play();

    rotate = () => this._whoosh();
    scroll = () => this._whoosh();

    brick = () =>
        this._getSound(
            this._getPathFileName(
                this._brick_sound,
                this._rnd(1, 6)),
            this.game.volume_effects
        )?.play();

    music = () =>
        this._getSound(
            `${this._base_path}${this._music_path}theme-piano.mp3`,
            this.game.volume_music
        )?.play();

    private _whoosh = () =>
        this._getSound(
            this._getPathFileName(
                this._rotate_sound,
                this._rnd(1, 7)),
            this.game.volume_effects
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

    private _rnd = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1) + min);
}
