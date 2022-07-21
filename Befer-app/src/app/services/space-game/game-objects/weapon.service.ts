import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { alien, bomb, bombUrl, bossAlien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  switchShotGun: boolean = false;

  constructor(private sharedService: SharedService) { }

  fireBombs(timestamp: number): void {
    if (bomb.nextFire < timestamp) {
      this.createBomb();
      bomb.nextFire = timestamp + bomb.fireInterval;

      if (spaceship.bonuses.doubleFire) {
        this.createBomb();
      }
    }
  }

  //Create and modify bomb
  createBomb(): void {
    const bombX = spaceship.x + (spaceship.width / 3);
    let bombY = (spaceship.y + (spaceship.height / 2));

    if (this.switchShotGun) {
      bombY -= bomb.height;
    }

    this.switchShotGun = !this.switchShotGun;

    this.sharedService.createEl(['bomb'], bombX, bombY, 'Bomb', bombUrl, bomb.width, bomb.height, '-2');
  }

  //Move bombs
  moveAllBombs(gameScreenWidth: number, bossEl: any = {}) {
    Array.from(document.getElementsByClassName('bomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        if (bossEl == {}) {
          Array.from(document.getElementsByClassName('alien'))
            .forEach(alienEl => {
              if (this.sharedService.hasCollision(bombEl, alienEl, 2)) {
                bombEl.remove();
                alienEl.remove();
                state.points += alien.healthPoints;
              }
            });
        } else {
          if (this.sharedService.hasCollision(bombEl, bossEl, 4)) {
            bombEl.remove();
            bossAlien.healthPoints -= 200;
          }
        }

        if (currentPosition < gameScreenWidth) {
          (bombEl as HTMLDivElement).style.left = currentPosition + bomb.speed + 'px';
        } else {
          bombEl.remove();
        }
      });
  }
}
