import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { alien, bomb, bombUrl, bossAlien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { SpaceGameService } from '../space-game.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  switchShotGun: boolean = false;
  bossHealthEl: any;

  constructor(
    private sharedService: SharedService) { }

  initialStartUp() {
    this.bossHealthEl = document.querySelector('.game-footer-img-boss-health img') as HTMLImageElement;
  }

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
  moveAllBombs(gameScreenWidth: number, bossEl: any = null) {
    Array.from(document.getElementsByClassName('bomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        if (!bossEl) {
          Array.from(document.getElementsByClassName('alien'))
            .forEach(alienEl => {
              if (this.sharedService.hasCollision(bombEl, alienEl, 0)) {
                bombEl.remove();
                alienEl.remove();
                state.points += alien.healthPoints;
                spaceship.aliensKilled++;
              }
            });
        } else {
          if (this.sharedService.hasCollision(bombEl, bossEl, 12)) {
            bombEl.remove();
            bossAlien.healthPoints -= 500;
            state.points += 500;

            if (bossAlien.healthPoints <= 0) {
              state.gameOver = true;
              state.gameWon = true;
            }

            if (bossAlien.healthPoints == 75000) {
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com1.png";
            } else if (bossAlien.healthPoints == 50000) {
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com2.png";
            } else if (bossAlien.healthPoints == 25000) {
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com3.png";
            }
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
