import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects, alienUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class AlienService {

  aliens: HTMLDivElement[] = [];

  constructor(private sharedService: SharedService) { }

  craeteAlien(gameScreenWidth: number, gameScreenHeight: number): void {
    const alienX = gameScreenWidth;
    const alienY = (gameScreenHeight - objects.alien.height) * Math.random();

    const alienEl = this.sharedService.createEl(['alien'], alienX, alienY, 'Alien', alienUrl, objects.alien.width, objects.alien.height, '-2');

    this.aliens.push(alienEl);
  }

  //Move alien and check for collision
  moveAllAliens(spaceshipEl: any): void {
    this.aliens
      .forEach(alienEl => {
        let currentPosition = parseInt(alienEl.style.left);

        if (!objects.spaceship.bonuses.invisible && this.sharedService.hasCollision(spaceshipEl, alienEl, 12)) {
          gameState.state.gameOver = true;
          this.sharedService.displayCollisionImg();
        }

        if (currentPosition > -80) {
          alienEl.style.left = currentPosition - objects.alien.speed + 'px';
        } else {
          objects.spaceship.aliensMissed++;
          this.removeAlien(alienEl);
        }
      });
  }

  removeAlien(alienEl: HTMLDivElement) {
    alienEl.remove();
    const aIndex = this.aliens.indexOf(alienEl);

    if (aIndex > -1) {
      this.aliens.splice(aIndex, 1);
    }
  }
}
