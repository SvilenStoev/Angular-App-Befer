import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects, bossBombUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class WeaponBossService {

  switchShotGun: boolean = false;
  spaceshipHealthEl: any;

  constructor(private sharedService: SharedService) { }

  initialStartUp(timestamp: number) {
    this.spaceshipHealthEl = document.querySelector('.game-footer-img-spaceship-health img') as HTMLImageElement;

    objects.bossBomb.nextTrippleFire = timestamp + 6000;
  }

  fireBombs(timestamp: number): void {
    if (objects.bossBomb.nextFire < timestamp) {
      this.createBomb();
      objects.bossBomb.nextFire = timestamp + objects.bossBomb.fireInterval;
    } else if (objects.bossBomb.nextTrippleFire + 600 < timestamp) {
      objects.bossBomb.nextTrippleFire = timestamp + objects.bossBomb.trippleFireInterval * Math.random();

      for (let y = objects.bossAlien.y; y < objects.bossAlien.y + 200; y += 90) {
        this.sharedService.createEl(['bossBomb'], objects.bossAlien.x + 80, y, 'Boss-Bomb', bossBombUrl, objects.bossBomb.width, objects.bossBomb.height, '-2');
      }
    }
  }

  //Create and modify bomb
  createBomb(y: number = objects.bossAlien.y): void {
    const bombX = objects.bossAlien.x + 80;
    let bombY = (y + (objects.bossAlien.height / 2));

    if (this.switchShotGun) {
      bombY -= objects.bossAlien.height / 2;
    }

    this.switchShotGun = !this.switchShotGun;

    this.sharedService.createEl(['bossBomb'], bombX, bombY, 'Boss-Bomb', bossBombUrl, objects.bossBomb.width, objects.bossBomb.height, '-2');
  }

  //Move bombs
  moveAllBombs(gameScreenWidth: number, spaceshipEl: any = {}) {
    Array.from(document.getElementsByClassName('bossBomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        if (!objects.spaceship.bonuses.invisible && this.sharedService.hasCollision(bombEl, spaceshipEl, 4)) {
          bombEl.remove();
          objects.spaceship.healthPoints -= 250;

          if (objects.spaceship.healthPoints == (objects.spaceship.initHealthPoints / 4 * 3)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health1.png";
          } else if (objects.spaceship.healthPoints == (objects.spaceship.initHealthPoints / 4 * 2)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health2.png";
          } else if (objects.spaceship.healthPoints == (objects.spaceship.initHealthPoints / 4 * 1)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health3.png";
          }

          if (objects.spaceship.healthPoints <= 0) {
            gameState.state.gameOver = true;
            this.sharedService.displayCollisionImg();
          }
        }

        if (currentPosition > -80) {
          (bombEl as HTMLDivElement).style.left = currentPosition - objects.bossBomb.speed + 'px';
        } else {
          bombEl.remove();
        }
      });
  }
}