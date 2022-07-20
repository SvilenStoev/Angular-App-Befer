import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { spaceship, spaceshipUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class SpaceshipService {

  spaceshipEl: HTMLDivElement;

  constructor(
    private sharedService: SharedService) { }

  createSpaceship(): HTMLDivElement {
    this.spaceshipEl = this.sharedService.createEl(['spaceship', 'hide'], spaceship.x, spaceship.y, 'Spaceship', spaceshipUrl, spaceship.width, spaceship.height, '-2');
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
    let speed = spaceship.speed;
    const isPointsP = state.points % 10 == 0;
    const isShiftCLicked = state.keys.ShiftLeft;

    //Calculate spaceship boost speed
    if (!isShiftCLicked && isPointsP && spaceship.boostSpeed < 100) {
      spaceship.boostSpeed += 0.33;
    }

    if (isShiftCLicked && spaceship.boostSpeed > 0.49) {
      speed *= 1.5;

      if (isPointsP) {
        spaceship.boostSpeed -= 1.9;
      }
    }
    
    if ((state.keys.KeyW || state.keys.ArrowUp) && spaceship.y > 0) {
      spaceship.y -= speed;
    }

    if ((state.keys.KeyS || state.keys.ArrowDown) && spaceship.y + spaceship.height + 10 < gameScreenHeight) {
      spaceship.y += speed;
    }

    if ((state.keys.KeyA || state.keys.ArrowLeft) && spaceship.x > 0) {
      spaceship.x -= speed;
    }

    if ((state.keys.KeyD || state.keys.ArrowRight) && spaceship.x + spaceship.width + 50 < gameScreenWidth) {
      spaceship.x += speed;
    }
  }

  moveSpaceship(): void {
    this.spaceshipEl.style.left = spaceship.x + 'px';
    this.spaceshipEl.style.top = spaceship.y + 'px';
  }
}
