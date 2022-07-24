import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { objects, bossAlienUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class BossService {

  bossEl: HTMLDivElement;

  constructor(private sharedService: SharedService) { }

  createBoss(gameScreenWidth: number): HTMLDivElement {
    objects.bossAlien.x = gameScreenWidth;
    this.bossEl = this.sharedService.createEl(['boss'], objects.bossAlien.x, objects.bossAlien.y, 'BossImg', bossAlienUrl, objects.bossAlien.width, objects.bossAlien.height, '-1');
    return this.bossEl;
  }

  //Modify boss possition
  async bossEntering() {
    while (objects.bossAlien.x > 1200) {
      objects.bossAlien.x -= objects.bossAlien.speed;
      this.moveBoss();

      await this.sharedService.sleep(20);
    }
  }

  calcBossPosition(gameScreenWidth: number, gameScreenHeight: number): void {
    const moveUp = objects.bossAlien.y > 0 && objects.bossAlien.y + 70 > objects.spaceship.y;
    const moveDown = objects.bossAlien.y + objects.bossAlien.height < gameScreenHeight && objects.bossAlien.y + 90 < objects.spaceship.y;
    
    if (moveUp) {
      objects.bossAlien.y -= objects.bossAlien.speed;
    } else if (moveDown) {
      objects.bossAlien.y += objects.bossAlien.speed;
    }
  }

  moveBoss(): void {
    this.bossEl.style.left = objects.bossAlien.x + 'px';
    this.bossEl.style.top = objects.bossAlien.y + 'px';
  }
}
