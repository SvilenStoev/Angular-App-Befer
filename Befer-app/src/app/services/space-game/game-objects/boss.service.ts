import { Injectable } from '@angular/core';
import { bossAlien, bossAlienUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class BossService {

  bossEl: HTMLDivElement;

  constructor(private sharedService: SharedService) { }

  createBoss(gameScreenWidth: number): HTMLDivElement {
    bossAlien.x = gameScreenWidth;
    this.bossEl = this.sharedService.createEl(['boss'], bossAlien.x, bossAlien.y, 'BossImg', bossAlienUrl, bossAlien.width, bossAlien.height, '-1');
    return this.bossEl;
  }

  //Modify boss possition
  async bossEntering() {
    while (bossAlien.x > 1200) {
      bossAlien.x -= bossAlien.speed;
      this.moveBoss();

      await this.sharedService.sleep(20);
    }
  }

  calcBossPosition(gameScreenWidth: number, gameScreenHeight: number): void {
    const moveUp = bossAlien.y > 0 && bossAlien.y + 70 > spaceship.y;
    const moveDown = bossAlien.y + bossAlien.height < gameScreenHeight && bossAlien.y + 90 < spaceship.y;
    
    if (moveUp) {
      bossAlien.y -= bossAlien.speed;
    } else if (moveDown) {
      bossAlien.y += bossAlien.speed;
    }
  }

  moveBoss(): void {
    this.bossEl.style.left = bossAlien.x + 'px';
    this.bossEl.style.top = bossAlien.y + 'px';
  }
}
