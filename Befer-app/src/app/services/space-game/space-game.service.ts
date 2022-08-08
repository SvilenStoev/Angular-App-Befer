import { Injectable } from '@angular/core';

import { SharedService } from './shared.service';
import { AlienService } from './game-objects/alien.service';
import { BonusService } from './game-objects/bonus.service';
import { WeaponService } from './game-objects/weapon.service';
import { SpaceshipService } from './game-objects/spaceship.service';
import { objects } from 'src/app/shared/space-fight-game/gameObjects';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { initState } from 'src/app/shared/space-fight-game/initialGameState';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

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
    if (gameState.availableKeys.includes(e.code)) {
      gameState.state.keys[e.code as keyof typeof gameState.state.keys] = true;
      
      if (e.code == 'KeyP') {
        gameState.state.isPaused = true;
      }

      if (e.code == 'KeyM') {
        gameState.state.openMenu = true;
      }
    }
  }

  onKeyUp(e: any) {
    if (gameState.availableKeys.includes(e.code)) {
      gameState.state.keys[e.code as keyof typeof gameState.state.keys] = false;
    }
  }

  //Create game objects, modify position and check for collision 
  modifyGameObjects(timestamp: number): void {
    //Create an alien
    if (objects.alien.nextCreation < timestamp) {
      this.alienService.craeteAlien(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
      objects.alien.nextCreation = timestamp + (objects.alien.creationInterval * Math.random()) + 500;
    }

    //Modify aliens position and check for collision with spaceship
    this.alienService.moveAllAliens(this.spaceshipEl);

    //Modify spaceship
    this.spaceshipService.calcSpaceshipPos(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.spaceshipService.moveSpaceship();

    //Fire bombs
    if (gameState.state.keys.Space || gameState.state.keys.NumpadEnter) {
      this.weaponService.fireBombs(timestamp);
    }

    //Modify bombs position and check for collision with aliens
    this.weaponService.moveAllBombs(this.gameScreenEl.offsetWidth);

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
  }

  calculateTotalPoints(): void {
    gameState.userScores.points = gameState.state.points;
    gameState.userScores.boostRemaining = objects.spaceship.boostSpeed < 0 ? 0 : Number(objects.spaceship.boostSpeed.toFixed());
    gameState.userScores.aliensKilled = objects.spaceship.aliensKilled;
    gameState.userScores.aliensMissed = objects.spaceship.aliensMissed;

    if (gameState.state.gameWon) {
      gameState.userScores.healthRemaining = objects.spaceship.healthPoints;
    }

    const pointsFromRemBoost = gameState.userScores.boostRemaining * 5000 / 100;
    const pointsFromAliensKilled = gameState.userScores.aliensKilled * 100;
    const pointsFromAliensMissed = -(gameState.userScores.aliensMissed * 500);
    const pointsFromTime = Math.floor(gameState.userScores.timeRemaining * 5000 / 60);
    const pointsFromRemHealth = gameState.userScores.healthRemaining * 5;

    gameState.userScores.totalPoints = gameState.state.points + pointsFromRemBoost + pointsFromAliensKilled + pointsFromAliensMissed + pointsFromTime + pointsFromRemHealth;
  }

  onRestart() {
    objects.spaceship.bonuses.aim = false;
    objects.spaceship.bonuses.doubleFire = false;
    objects.spaceship.bonuses.invisible = false;

    for (const key in initState.state) {
      gameState.state[key as keyof typeof gameState.state] = initState.state[key as keyof typeof initState.state];
    }

    for (const key in initState.userScores) {
      gameState.userScores[key as keyof typeof gameState.userScores] = initState.userScores[key as keyof typeof initState.userScores];
    }

    for (const key in objects.spaceship) {
      objects.spaceship[key as keyof typeof objects.spaceship] = initState.spaceship[key as keyof typeof initState.spaceship];
    }

    for (const key in objects.alien) {
      objects.alien[key as keyof typeof objects.alien] = initState.alien[key as keyof typeof initState.alien];
    }

    for (const key in objects.bossAlien) {
      objects.bossAlien[key as keyof typeof objects.bossAlien] = initState.bossAlien[key as keyof typeof initState.bossAlien];
    }

    for (const key in objects.bomb) {
      objects.bomb[key as keyof typeof objects.bomb] = initState.bomb[key as keyof typeof initState.bomb];
    }

    for (const key in objects.bossBomb) {
      objects.bossBomb[key as keyof typeof objects.bossBomb] = initState.bossBomb[key as keyof typeof initState.bossBomb];
    }

    this.bonusService.clearActiveBonuses();
    this.spaceshipEl.remove();

    //Remove all possible game objects that could be remain on the screen after game over and restart.
    Array.from(document.getElementsByClassName('boss')).forEach(b => b.remove());
    Array.from(document.getElementsByClassName('bonus')).forEach(b => b.remove());
    Array.from(document.getElementsByClassName('alien')).forEach(a => a.remove());
    Array.from(document.getElementsByClassName('bomb')).forEach(b => b.remove());
    Array.from(document.getElementsByClassName('bossBomb')).forEach(b => b.remove());
  }
}
