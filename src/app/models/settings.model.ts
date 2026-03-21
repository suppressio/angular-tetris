export interface SettingsDialog {
    show_dialog: boolean,
    settings: Setting[];
    buttons: DialogButton[];
}

export interface Setting {
    icon?: string;
    label: string;
    value:
    | boolean
    | number
    | string
    | Setting[];
}

export interface DialogButton {
    label: string,
    fn(): void,
    className?: string,
}