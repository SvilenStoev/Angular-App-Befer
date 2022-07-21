import { Injectable } from '@angular/core';
import { bomb, bossAlien, bossBomb, bossBombUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponBossService {

  switchShotGun: boolean = false;

  constructor(private sharedService: SharedService) { }

  fireBombs(timestamp: number): void {
    if (bossBomb.nextFire < timestamp) {
      this.createBomb();
      bossBomb.nextFire = timestamp + bossBomb.fireInterval;
    }
  }

  //Create and modify bomb
  createBomb(): void {
    const bombX = bossAlien.x + 80;
    let bombY = (bossAlien.y + (bossAlien.height / 2));

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

        if (this.sharedService.hasCollision(bombEl, spaceshipEl, 4)) {
          bombEl.remove();
          spaceship.healthPoints -= 2000;
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