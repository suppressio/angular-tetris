import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameStateService } from './services/game-state.service';
import { SoundsService } from './services/sounds.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    GameStateService,
    SoundsService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
