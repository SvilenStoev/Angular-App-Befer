import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { spaceship, spaceshipUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class SpaceshipService {

  spaceshipEl: any = {};

  constructor(
    private sharedService: SharedService) { }

  //1. Spaceship
  createSpaceship(): any {
    this.spaceshipEl = this.sharedService.createEl(['spaceship', 'hide'], spaceship.x, spaceship.y, 'Spaceship', spaceshipUrl, spaceship.width, spaceship.height);
    return this.spaceshipEl;
  }

  //Modify spaceship possition
  async spaceshipEntering() {
    while (spaceship.x < 150) {
      spaceship.x += spaceship.speed;
      this.moveSpaceship();

      await this.sharedService.sleep(15);
    }
  }

  calcSpaceshipPos(gameScreenWidth: number, gameScreenHeight: number): void {
    if ((state.keys.KeyW || state.keys.ArrowUp) && spaceship.y > 0) {
      spaceship.y -= spaceship.speed;
    }

    if ((state.keys.KeyS || state.keys.ArrowDown) && spaceship.y + spaceship.height + 10 < gameScreenHeight) {
      spaceship.y += spaceship.speed;
    }

    if ((state.keys.KeyA || state.keys.ArrowLeft) && spaceship.x > 0) {
      spaceship.x -= spaceship.speed;
    }

    if ((state.keys.KeyD || state.keys.ArrowRight) && spaceship.x + spaceship.width + 50 < gameScreenWidth) {
      spaceship.x += spaceship.speed;
    }
  }

  moveSpaceship(): void {
    this.spaceshipEl.style.top = spaceship.y + 'px';
    this.spaceshipEl.style.left = spaceship.x + 'px';
  }
}
