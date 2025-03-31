import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SettingsDialogService } from 'src/app/services/settings-dialog.service';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  standalone: true,
  imports: [NgFor],
  providers: [SettingsDialogService],
})
export class SettingsDialogComponent implements OnInit {
  protected title = '';
  protected buttons = this.settings.buttons;

  constructor(private settings: SettingsDialogService) {}

  ngOnInit(): void {
    this.settings.show_dialog = true;
  }
}