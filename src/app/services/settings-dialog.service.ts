import { Injectable } from "@angular/core";
import { DialogButton, Setting, SettingsDialog } from "../models/settings.model";

@Injectable()
export class SettingsDialogService implements SettingsDialog {
    settings: Setting[] = [];

    buttons: DialogButton[] = [{
        label: "Close",
        fn: () => this.close(),
    },
    {
        label: "Save",
        fn: () => this.apply(),
    }];

    private _show = false;

    get show_dialog(): boolean {
        return this._show;
    }

    set show_dialog(s: boolean) {
        this._show = s;
    }

    open(): void {
        this.show_dialog = true;
    }

    close(): void {
        this.show_dialog = false;
    }

    // Speed: 1 (slowest, 1000ms) → 10 (fastest, 100ms). Formula: delay = (11 - speed) * 100
    speed = 10;

    get delay(): number {
        return (11 - this.speed) * 100;
    }

    apply(): void {}
}