import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameStateService } from './services/game-state.service';
import { SoundsService } from './services/sounds.service';
import { TetrisComponent } from './components/tetris/tetris.component';
import { InputsService } from './services/inputs.service';

@NgModule({
  declarations: [
    AppComponent,
    TetrisComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    GameStateService,
    SoundsService,
    InputsService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
