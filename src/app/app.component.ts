import { AfterViewInit, Component } from '@angular/core';

import * as fromGame from './game';
import * as createjs from 'createjs-module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'twoDGame';

  ngAfterViewInit(): void {
    const stage = new createjs.Stage('demoCanvas');
    fromGame.Galaga(stage);
  }
}
