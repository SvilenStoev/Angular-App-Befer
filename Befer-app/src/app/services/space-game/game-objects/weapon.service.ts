import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects, bombUrl } from 'src/app/shared/space-fight-game/gameObjects';

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
    if (objects.bomb.nextFire < timestamp) {
      this.createBomb();
      objects.bomb.nextFire = timestamp + objects.bomb.fireInterval;

      if (objects.spaceship.bonuses.doubleFire) {
        this.createBomb();
      }
    }
  }

  //Create and modify bomb
  createBomb(): void {
    const bombX = objects.spaceship.x + (objects.spaceship.width / 3);
    let bombY = (objects.spaceship.y + (objects.spaceship.height / 2));

    if (this.switchShotGun) {
      bombY -= objects.bomb.height;
    }

    this.switchShotGun = !this.switchShotGun;

    this.sharedService.createEl(['bomb'], bombX, bombY, 'Bomb', bombUrl, objects.bomb.width, objects.bomb.height, '-2');
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
                gameState.state.points += objects.alien.healthPoints;
                objects.spaceship.aliensKilled++;
              }
            });
        } else {
          if (this.sharedService.hasCollision(bombEl, bossEl, 12)) {
            bombEl.remove();
            objects.bossAlien.healthPoints -= 500;
            gameState.state.points += 500;

            if (objects.bossAlien.healthPoints <= 0) {
              gameState.state.gameOver = true;
              gameState.state.gameWon = true;
              bossEl.remove();
            }

            if (objects.bossAlien.healthPoints == 75000) {
              this.modifyBossDificulty();
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com1.png";
            } else if (objects.bossAlien.healthPoints == 50000) {
              this.modifyBossDificulty();
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com2.png";
            } else if (objects.bossAlien.healthPoints == 25000) {
              this.modifyBossDificulty();
              this.bossHealthEl.src = "../../../../assets/images/boss-health.com3.png";
            }
          }
        }

        if (currentPosition < gameScreenWidth) {
          (bombEl as HTMLDivElement).style.left = currentPosition + objects.bomb.speed + 'px';
        } else {
          bombEl.remove();
        }
      });
  }

  modifyBossDificulty(): void {
    objects.bossBomb.speed++;
    objects.bossBomb.fireInterval -= 60;
    objects.bossBomb.trippleFireInterval -= 500;
  }
}
