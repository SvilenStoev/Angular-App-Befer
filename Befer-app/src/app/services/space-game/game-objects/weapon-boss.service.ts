import { Injectable } from '@angular/core';
import { bomb, bossAlien, bossBomb, bossBombUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SharedService } from '../shared.service';
import { SpaceGameService } from '../space-game.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponBossService {

  switchShotGun: boolean = false;
  spaceshipHealthEl: any;

  constructor(private sharedService: SharedService) { }

  initialStartUp() {
    this.spaceshipHealthEl = document.querySelector('.game-footer-img-spaceship-health img') as HTMLImageElement;
  }

  fireBombs(timestamp: number): void {
    if (bossBomb.nextFire < timestamp) {
      this.createBomb();
      bossBomb.nextFire = timestamp + bossBomb.fireInterval;
    } else if (bossBomb.nextTrippleFire < timestamp) {
      bossBomb.nextTrippleFire = timestamp + bossBomb.trippleFireInterval * Math.random() + 1000;

      for (let y = bossAlien.y; y < bossAlien.y + 200; y += 90) {
        this.sharedService.createEl(['bossBomb'], bossAlien.x + 80, y, 'Boss-Bomb', bossBombUrl, bossBomb.width, bossBomb.height, '-2');
      }
    }
  }

  //Create and modify bomb
  createBomb(y: number = bossAlien.y): void {
    const bombX = bossAlien.x + 80;
    let bombY = (y + (bossAlien.height / 2));

    if (this.switchShotGun) {
      bombY -= bossAlien.height / 2;
    }

    this.switchShotGun = !this.switchShotGun;

    this.sharedService.createEl(['bossBomb'], bombX, bombY, 'Boss-Bomb', bossBombUrl, bossBomb.width, bossBomb.height, '-2');
  }

  //Move bombs
  moveAllBombs(gameScreenWidth: number, spaceshipEl: any = {}) {
    Array.from(document.getElementsByClassName('bossBomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        if (!spaceship.bonuses.invisible && this.sharedService.hasCollision(bombEl, spaceshipEl, 4)) {
          bombEl.remove();
          spaceship.healthPoints -= 250;

          if (spaceship.healthPoints == (spaceship.initHealthPoints / 4 * 3)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health1.png";
          } else if (spaceship.healthPoints == (spaceship.initHealthPoints / 4 * 2)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health2.png";
          } else if (spaceship.healthPoints == (spaceship.initHealthPoints / 4 * 1)) {
            this.spaceshipHealthEl.src = "../../../../assets/images/spaceship-health3.png";
          }

          if (spaceship.healthPoints <= 0) {
            state.gameOver = true;
            this.sharedService.displayCollisionImg();
          }
        }

        if (currentPosition > -80) {
          (bombEl as HTMLDivElement).style.left = currentPosition - bossBomb.speed + 'px';
        } else {
          bombEl.remove();
        }
      });
  }
}