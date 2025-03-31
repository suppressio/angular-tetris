import { Injectable } from "@angular/core";
import { DialogButton, Setting, SettingsDialog } from "../models/settings.model";

@Injectable()
export class SettingsDialogService implements SettingsDialog {
    settings: Setting[] = [];

    buttons: DialogButton[] = [{
        label: "Close",
        fn: this.close,
    },
    {
        label: "Save",
        fn: this.apply,
    }];

    private _show = false;

    get show_dialog(): boolean {
        return this._show;
    }

    set show_dialog(s: boolean) {
        this._show = s;
    }

    close(): void {
        this.show_dialog = false;
    }

    apply(): void {

    }
}