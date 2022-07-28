import { Injectable } from '@angular/core';

import { SharedService } from './shared.service';
import { BossService } from './game-objects/boss.service';
import { BonusService } from './game-objects/bonus.service';
import { WeaponService } from './game-objects/weapon.service';
import { SpaceshipService } from './game-objects/spaceship.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects } from 'src/app/shared/space-fight-game/gameObjects';
import { WeaponBossService } from './game-objects/weapon-boss.service';

@Injectable({
  providedIn: 'root'
})
export class BossGameService {

  bossEl: HTMLDivElement;
  spaceshipEl: HTMLDivElement;
  gameScreenEl: any;

  constructor(
    private bossService: BossService,
    private spaceshipService: SpaceshipService,
    private weaponBossService: WeaponBossService,
    private weaponService: WeaponService,
    private bonusService: BonusService,
    private sharedService: SharedService) { }

  //Initial game configuration for Boss mode
  initialStartUpBossMode(timestamp: number): void {
    this.spaceshipEl = (document.querySelector('.spaceship')) as HTMLDivElement;
    this.gameScreenEl = document.querySelector('.game-view');
    this.gameScreenEl.style.border = '3px dashed darkred';

    this.weaponBossService.initialStartUp(timestamp);
    this.weaponService.initialStartUp();

    this.bossEl = this.bossService.createBoss(this.gameScreenEl.offsetWidth);
    this.bossService.bossEntering();

    const timeEl = document.querySelector('#remaining-time');
    this.startTimerForBossMode(300, timeEl);
  }

  //Create game objects, modify position and check for collision in Boss Game Mode
  modifyGameObjectsBossMode(timestamp: number): void {
    //Modify spaceship
    this.spaceshipService.calcSpaceshipPos(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.spaceshipService.moveSpaceship();

    if (!objects.spaceship.bonuses.invisible && this.sharedService.hasCollision(this.spaceshipEl, this.bossEl, 12)) {
      gameState.state.gameOver = true;
      this.sharedService.displayCollisionImg();
    }

    //Fire bombs
    if (gameState.state.keys.Space || gameState.state.keys.NumpadEnter) {
      this.weaponService.fireBombs(timestamp);
    }

    //Modify bombs position and check for collision with boss
    this.weaponService.moveAllBombs(this.gameScreenEl.offsetWidth, this.bossEl);

    //Boss fires bombs
    this.weaponBossService.fireBombs(timestamp);

    //Modify bombs position and check for collision with boss
    this.weaponBossService.moveAllBombs(this.gameScreenEl.offsetWidth, this.spaceshipEl);

    //Create random bonuses
    this.bonusService.createBonuses(timestamp, this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);

    //Move bonuses only if there is bonuses on the screen (because they will be rare) and check for collision with spaceship
    if (gameState.state.hasBonuses) {
      if (document.getElementsByClassName('bonus').length > 0) {
        this.bonusService.moveAllBonuses(this.spaceshipEl);
      } else {
        gameState.state.hasBonuses = false;
      }
    }

    //Modify Boss
    this.bossService.calcBossPosition(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.bossService.moveBoss();
  }

  startTimerForBossMode(duration: number, timeEl: any) {
    const start = Date.now();

    function timer() {
      if (gameState.state.gameOver) {
        clearInterval(refreshIntervalId);
        return;
      }

      const diff = duration - (((Date.now() - start) / 1000) | 0);

      gameState.userScores.timeRemaining = diff;

      let minutes = (diff / 60) | 0;
      let seconds = (diff % 60) | 0;

      let minStr = (minutes < 10 ? '0' + minutes : minutes).toString();
      let secStr = (seconds < 10 ? '0' + seconds : seconds).toString();

      timeEl.textContent = minStr + ':' + secStr;

      if (minutes <= 0 && seconds <= 0) {
        gameState.state.gameOver = true;
        clearInterval(refreshIntervalId);
        return;
      }
    };

    timer();
    const refreshIntervalId = setInterval(timer, 1000);
  }
}
