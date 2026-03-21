import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsDialogService } from 'src/app/services/settings-dialog.service';
import { SoundsService } from 'src/app/services/sounds.service';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  standalone: true,
  imports: [NgClass, FormsModule],
})
export class SettingsDialogComponent implements OnInit {
  protected readonly title = 'Settings';

  protected speed = 10;
  protected soundEnabled = false;
  protected volumeEffects = 80;
  protected volumeMusic = 60;

  private _snapshot = { speed: 10, enabled: false, effects: 0, music: 0 };

  private settings = inject(SettingsDialogService);
  private sounds = inject(SoundsService);

  ngOnInit(): void {
    this._snapshot = {
      speed: this.settings.speed,
      enabled: this.sounds.enabled,
      effects: Math.round(this.sounds.volume_effects * 100),
      music: Math.round(this.sounds.volume_music * 100),
    };
    this.speed = this._snapshot.speed;
    this.soundEnabled = this._snapshot.enabled;
    this.volumeEffects = this._snapshot.effects;
    this.volumeMusic = this._snapshot.music;
  }

  close(): void {
    this.settings.close();
  }

  save(): void {
    this.settings.speed = this.speed;
    this.sounds.enabled = this.soundEnabled;
    this.sounds.volume_effects = this.volumeEffects / 100;
    this.sounds.volume_music = this.volumeMusic / 100;
    this.settings.close();
  }
}