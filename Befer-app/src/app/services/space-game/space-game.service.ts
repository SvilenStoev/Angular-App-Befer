import { Injectable } from '@angular/core';

import { state, availableKeys, initState, userScores } from 'src/app/shared/space-fight-game/gameState';
import { SharedService } from './shared.service';
import { AlienService } from './game-objects/alien.service';
import { SpaceshipService } from './game-objects/spaceship.service';
import { alien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { WeaponService } from './game-objects/weapon.service';
import { BonusService } from './game-objects/bonus.service';
import { BossService } from './game-objects/boss.service';
import { WeaponBossService } from './game-objects/weapon-boss.service';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

  bossEl: HTMLDivElement;
  spaceshipEl: HTMLDivElement;
  gameScreenEl: any;

  constructor(
    private alienService: AlienService,
    private spaceshipService: SpaceshipService,
    private weaponService: WeaponService,
    private bonusService: BonusService,
    private sharedService: SharedService) { }

  //Initial game configuration
  initialStartUp(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.gameScreenEl = document.querySelector('.game-view');
    this.sharedService.gameScreenEl = this.gameScreenEl;
    this.gameScreenEl.style.border = '2px dashed white';

    this.spaceshipEl = this.spaceshipService.createSpaceship();
    this.spaceshipService.spaceshipEntering();
  }

  //Track user keyboard input
  onKeyDown(e: any) {
    if (availableKeys.includes(e.code)) {
      state.keys[e.code as keyof typeof state.keys] = true;

      if (e.code == 'KeyP') {
        state.isPaused = true;
      }

      if (e.code == 'KeyM') {
        state.openMenu = true;
      }
    }
  }

  onKeyUp(e: any) {
    if (availableKeys.includes(e.code)) {
      state.keys[e.code as keyof typeof state.keys] = false;
    }
  }

  //Create game objects, modify position and check for collision 
  modifyGameObjects(timestamp: number): void {
    //Create an alien
    if (alien.nextCreation < timestamp) {
      this.alienService.craeteAlien(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
      alien.nextCreation = timestamp + (alien.creationInterval * Math.random()) + 500;
    }

    //Modify aliens position and check for collision with spaceship
    this.alienService.moveAllAliens(this.spaceshipEl);

    //Modify spaceship
    this.spaceshipService.calcSpaceshipPos(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.spaceshipService.moveSpaceship();

    //Fire bombs
    if (state.keys.Space) {
      this.weaponService.fireBombs(timestamp);
    }

    //Modify bombs position and check for collision with aliens
    this.weaponService.moveAllBombs(this.gameScreenEl.offsetWidth);

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
  }

  calculateTotalPoints(): void {
    userScores.points = state.points;
    userScores.boostRemaining = spaceship.boostSpeed < 0 ? 0 : Number(spaceship.boostSpeed.toFixed());
    userScores.aliensKilled = spaceship.aliensKilled;
  
    const pointsFromRemBoost = userScores.boostRemaining * 10000 / 100;
    const pointsFromAliensKilled = userScores.aliensKilled * 100;

    userScores.totalPoints = state.points + pointsFromRemBoost + pointsFromAliensKilled;
  }

  onRestart() {
    spaceship.x = spaceship.initX;
    spaceship.y = spaceship.initY;
    spaceship.aliensKilled = 0;
    spaceship.boostSpeed = 0;
    spaceship.bonuses.aim = false;
    spaceship.bonuses.doubleFire = false;
    spaceship.bonuses.invisible = false;

    this.bonusService.clearActiveBonuses();

    for (const key in initState) {
      state[key as keyof typeof state] = initState[key as keyof typeof initState];
    }

    this.spaceshipEl.remove();

    if (this.bossEl) {
      this.bossEl.remove();
    }

    //Remove all possible game objects that could be remain on the screen after game over and restart.
    Array.from(document.getElementsByClassName('bonus')).forEach(b => b.remove());
    Array.from(document.getElementsByClassName('alien')).forEach(a => a.remove());
    Array.from(document.getElementsByClassName('bomb')).forEach(b => b.remove());
    Array.from(document.getElementsByClassName('bossBomb')).forEach(b => b.remove());
  }
}
