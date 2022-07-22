import { Injectable } from '@angular/core';
import { spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { state, userScores } from 'src/app/shared/space-fight-game/gameState';
import { BonusService } from './game-objects/bonus.service';
import { BossService } from './game-objects/boss.service';
import { SpaceshipService } from './game-objects/spaceship.service';
import { WeaponBossService } from './game-objects/weapon-boss.service';
import { WeaponService } from './game-objects/weapon.service';
import { SharedService } from './shared.service';

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
    private bonusService: BonusService) { }

  //Initial game configuration for Boss mode
  initialStartUpBossMode(): void {
    this.spaceshipEl = (document.querySelector('.spaceship')) as HTMLDivElement;
    this.gameScreenEl = document.querySelector('.game-view');
    this.gameScreenEl.style.border = '3px dashed darkred';

    this.weaponBossService.initialStartUp();
    this.weaponService.initialStartUp();

    this.bossEl = this.bossService.createBoss(this.gameScreenEl.offsetWidth);
    this.bossService.bossEntering();

    const timeEl = document.querySelector('#remaining-time');
    this.startTimerForBossMode(360, timeEl);
  }

  //Create game objects, modify position and check for collision in Boss Game Mode
  modifyGameObjectsBossMode(timestamp: number): void {
    //Modify spaceship
    this.spaceshipService.calcSpaceshipPos(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.spaceshipService.moveSpaceship();

    //Fire bombs
    if (state.keys.Space) {
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
    if (state.hasBonuses) {
      if (document.getElementsByClassName('bonus').length > 0) {
        this.bonusService.moveAllBonuses(this.spaceshipEl);
      } else {
        state.hasBonuses = false;
      }
    }

    //Modify Boss
    this.bossService.calcBossPosition(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.bossService.moveBoss();
  }

  startTimerForBossMode(duration: number, timeEl: any) {
    const start = Date.now();

    function timer() {
      if (state.gameOver) {
        clearInterval(refreshIntervalId);
        return;
      }

      const diff = duration - (((Date.now() - start) / 1000) | 0);

      userScores.timeRemaining = diff;

      let minutes = (diff / 60) | 0;
      let seconds = (diff % 60) | 0;

      let minStr = (minutes < 10 ? '0' + minutes : minutes).toString();
      let secStr = (seconds < 10 ? '0' + seconds : seconds).toString();

      timeEl.textContent = minStr + ':' + secStr;

      if (minutes <= 0 && seconds <= 0) {
        state.gameOver = true;
        clearInterval(refreshIntervalId);
        return;
      }
    };

    timer();
    const refreshIntervalId = setInterval(timer, 1000);
  }
}
