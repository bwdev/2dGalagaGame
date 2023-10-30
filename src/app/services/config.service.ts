import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  gameSettings = {
    lives: 3,
    bossHealth: 20,
  }

  constructor() { }
}
