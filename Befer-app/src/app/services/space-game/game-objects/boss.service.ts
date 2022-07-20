import { Injectable } from '@angular/core';
import { bossAlien, bossAlienUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class BossService {

  bossEl: HTMLDivElement;

  constructor(private sharedService: SharedService) { }

  createBoss(gameScreenWidth: number): HTMLDivElement {
    bossAlien.x = gameScreenWidth;
    this.bossEl = this.sharedService.createEl(['boss'], bossAlien.x, bossAlien.y, 'BossImg', bossAlienUrl, bossAlien.width, bossAlien.height);
    return this.bossEl;
  }

  //Modify spaceship possition
  async bossEntering() {
    while (bossAlien.x > 1200) {
      bossAlien.x -= bossAlien.speed;
      this.moveBoss();

      await this.sharedService.sleep(20);
    }
  }

  moveBoss(): void {
    this.bossEl.style.left = bossAlien.x + 'px';
    this.bossEl.style.top = bossAlien.y + 'px';
  }
}
