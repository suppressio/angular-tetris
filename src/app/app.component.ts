import { Component } from '@angular/core';
import { TetrisComponent } from './components/tetris/tetris.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [TetrisComponent],
})
export class AppComponent {}