import { Injectable } from '@angular/core';

import { SharedService } from '../shared.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects, aimBonusUrl, doubleFireUrl, invisibleBonusUrl } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class BonusService {

  doubleBonusFooterEl: any;
  aimBonusFooterEl: any;
  invisibleBonusFooterEl: any;

  constructor(private sharedService: SharedService) { }

  //TODO: get by ID
  setBonusFooterElements() {
    this.doubleBonusFooterEl = document.querySelector('.game-footer-img-double');
    this.aimBonusFooterEl = document.querySelector('.game-footer-img-aim');
    this.invisibleBonusFooterEl = document.querySelector('.game-footer-img-invisible');
  }

  //TODO: Check for solution. Timestamp increses even if game is not started yet. 
  //If button "start game" isn't clicked soon after component init the bonuses will be created immediately after game started! 
  createBonuses(timestamp: number, gameScreenWidth: number, gameScreenHeight: number): void {
    //Create an double-fire-bonus
    if (objects.doubleFireBonus.nextCreation < timestamp) {
      this.createDoubleFireBonus(gameScreenWidth, gameScreenHeight);

      gameState.state.hasBonuses = true;
      objects.doubleFireBonus.nextCreation = timestamp + (objects.doubleFireBonus.creationInterval * Math.random()) + 7000;
    }

    //Create an aim-bonus
    if (objects.aimBonus.nextCreation < timestamp) {
      this.createAimBonus(gameScreenWidth, gameScreenHeight);

      gameState.state.hasBonuses = true;
      objects.aimBonus.nextCreation = timestamp + (objects.aimBonus.creationInterval * Math.random()) + 20000;
    }

    //Create an invisible-bonus
    if (objects.invisibleBonus.nextCreation < timestamp) {
      this.createInsivibleBonus(gameScreenWidth, gameScreenHeight);

      gameState.state.hasBonuses = true;
      objects.invisibleBonus.nextCreation = timestamp + (objects.invisibleBonus.creationInterval * Math.random()) + 30000;
    }
  }

  //Modify bonuses
  createDoubleFireBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const fireBonusX = gameScreenWidth;
    const fireBonusY = (gameScreenHeight - objects.doubleFireBonus.height) * Math.random();
    const classesArr = ['double-fire-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, fireBonusX, fireBonusY, 'Double-fire-bonus', doubleFireUrl, objects.doubleFireBonus.width, objects.doubleFireBonus.height, '-3');
  }

  createAimBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const aimBonusX = gameScreenWidth;
    const aimBonusY = (gameScreenHeight - objects.doubleFireBonus.height) * Math.random();
    const classesArr = ['aim-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, aimBonusX, aimBonusY, 'Aim-bonus', aimBonusUrl, objects.aimBonus.width, objects.aimBonus.height, '-3');
  }

  createInsivibleBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const invisibleBonusX = gameScreenWidth;
    const invisibleBonusY = (gameScreenHeight - objects.doubleFireBonus.height) * Math.random();
    const classesArr = ['invisible-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, invisibleBonusX, invisibleBonusY, 'Invisible-bonus', invisibleBonusUrl, objects.invisibleBonus.width, objects.invisibleBonus.height, '-3');
  }

  moveAllBonuses(spaceshipEl: any) {
    Array.from(document.getElementsByClassName('bonus'))
      .forEach(bonusEl => {
        let currentPosition = parseInt((bonusEl as HTMLDivElement).style.left);

        if (currentPosition > 0) {
          (bonusEl as HTMLDivElement).style.left = currentPosition - objects.doubleFireBonus.speed + 'px';
        } else {
          bonusEl.remove();
        }

        if (!this.doubleBonusFooterEl) {
          this.setBonusFooterElements();
        }

        if (this.sharedService.hasCollision(spaceshipEl, bonusEl, 6)) {
          //TODO: Impove the check
          if (bonusEl.classList.contains('aim-bonus')) {
            objects.spaceship.bonuses.aim = true;
            this.aimBonusFooterEl.classList.add('footer-img-active');

            spaceshipEl.classList.remove('hide');

            setTimeout(() => {
              objects.spaceship.bonuses.aim = false;
              this.aimBonusFooterEl.classList.remove('footer-img-active');
              spaceshipEl.classList.add('hide');
            }, objects.aimBonus.timeLast);
          } else if (bonusEl.classList.contains('invisible-bonus')) {
            objects.spaceship.bonuses.invisible = true;
            spaceshipEl.style.opacity = '40%';
            this.invisibleBonusFooterEl.classList.add('footer-img-active');

            setTimeout(() => {
              objects.spaceship.bonuses.invisible = false;
              spaceshipEl.style.opacity = '100%';
              this.invisibleBonusFooterEl.classList.remove('footer-img-active');
            }, objects.invisibleBonus.timeLast);
          }
          else {
            objects.spaceship.bonuses.doubleFire = true;
            this.doubleBonusFooterEl.classList.add('footer-img-active');

            setTimeout(() => {
              objects.spaceship.bonuses.doubleFire = false;
              this.doubleBonusFooterEl.classList.remove('footer-img-active');
            }, objects.doubleFireBonus.timeLast);
          }

          bonusEl.remove();
        }
      });
  }

  clearActiveBonuses(): void {
    this.setBonusFooterElements();

    this.aimBonusFooterEl.classList.remove('footer-img-active');
    this.invisibleBonusFooterEl.classList.remove('footer-img-active');
    this.doubleBonusFooterEl.classList.remove('footer-img-active');
  }
}
