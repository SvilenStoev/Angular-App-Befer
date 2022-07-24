import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects, spaceshipUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class SpaceshipService {

  spaceshipEl: HTMLDivElement;

  constructor(
    private sharedService: SharedService) { }

  createSpaceship(): HTMLDivElement {
    this.spaceshipEl = this.sharedService.createEl(['spaceship', 'hide'], objects.spaceship.x, objects.spaceship.y, 'Spaceship', spaceshipUrl, objects.spaceship.width, objects.spaceship.height, '-2');
    return this.spaceshipEl;
  }

  //Modify spaceship possition
  async spaceshipEntering() {
    while (objects.spaceship.x < 150) {
      objects.spaceship.x += objects.spaceship.speed;
      this.moveSpaceship();

      await this.sharedService.sleep(15);
    }
  }

  calcSpaceshipPos(gameScreenWidth: number, gameScreenHeight: number): void {
    let speed = objects.spaceship.speed;
    const isPointsP = gameState.state.points % 10 == 0;
    const isShiftCLicked = gameState.state.keys.ShiftLeft;

    //Calculate spaceship boost speed
    if (!isShiftCLicked && isPointsP && objects.spaceship.boostSpeed < 100) {
      objects.spaceship.boostSpeed += 0.33;
    }

    if (isShiftCLicked && objects.spaceship.boostSpeed > 0.49) {
      speed *= 1.5;

      if (isPointsP) {
        objects.spaceship.boostSpeed -= 1.9;
      }
    }
    
    if ((gameState.state.keys.KeyW || gameState.state.keys.ArrowUp) && objects.spaceship.y > 0) {
      objects.spaceship.y -= speed;
    }

    if ((gameState.state.keys.KeyS || gameState.state.keys.ArrowDown) && objects.spaceship.y + objects.spaceship.height + 10 < gameScreenHeight) {
      objects.spaceship.y += speed;
    }

    if ((gameState.state.keys.KeyA || gameState.state.keys.ArrowLeft) && objects.spaceship.x > 0) {
      objects.spaceship.x -= speed;
    }

    if ((gameState.state.keys.KeyD || gameState.state.keys.ArrowRight) && objects.spaceship.x + objects.spaceship.width + 50 < gameScreenWidth) {
      objects.spaceship.x += speed;
    }
  }

  moveSpaceship(): void {
    this.spaceshipEl.style.left = objects.spaceship.x + 'px';
    this.spaceshipEl.style.top = objects.spaceship.y + 'px';
  }
}
