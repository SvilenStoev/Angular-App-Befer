import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { alien, alienUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class AlienService {

  constructor(private sharedService: SharedService) { }

  craeteAlien(gameScreenWidth: number, gameScreenHeight: number): void {
    const alienX = gameScreenWidth;
    const alienY = (gameScreenHeight - alien.height) * Math.random();

    this.sharedService.createEl(['alien'], alienX, alienY, 'Alien', alienUrl, alien.width, alien.height, '-2');
  }

  //Move alien and check for collision
  moveAllAliens(spaceshipEl: any): void {
    Array.from(document.getElementsByClassName('alien'))
      .forEach(alienEl => {
        let currentPosition = parseInt((alienEl as HTMLDivElement).style.left);

        if (!spaceship.bonuses.invisible && this.sharedService.hasCollision(spaceshipEl, alienEl, 12)) {
          state.gameOver = true;
          this.sharedService.displayCollisionImg();
        }

        if (currentPosition > -80) {
          (alienEl as HTMLDivElement).style.left = currentPosition - alien.speed + 'px';
        } else {
          alienEl.remove();
        }
      });
  }
}
