import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SettingsDialogService } from 'src/app/services/settings-dialog.service';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class SettingsDialogComponent {
  protected title = '';
  protected buttons = this.settings.buttons;

  constructor(private settings: SettingsDialogService) {}
}