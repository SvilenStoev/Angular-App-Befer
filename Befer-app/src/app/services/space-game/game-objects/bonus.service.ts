import { Injectable } from '@angular/core';
import { aimBonus, aimBonusUrl, doubleFireBonus, doubleFireUrl, invisibleBonus, invisibleBonusUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class BonusService {

  doubleBonusFooterEl: any;
  aimBonusFooterEl: any;
  invisibleBonusFooterEl: any;

  constructor(private sharedService: SharedService) { }

  setBonusFooterElements() {
    this.doubleBonusFooterEl = document.querySelector('.game-footer-img-double');
    this.aimBonusFooterEl = document.querySelector('.game-footer-img-aim');
    this.invisibleBonusFooterEl = document.querySelector('.game-footer-img-invisible');
  }

  //TODO: Check for solution. Timestamp increses even if game is not started yet. 
  //If button "start game" isn't clicked soon after component init the bonuses will be created immediately after game started! 
  createBonuses(timestamp: number, gameScreenWidth: number, gameScreenHeight: number): void {
    //Create an double-fire-bonus
    if (doubleFireBonus.nextCreation < timestamp) {
      this.createDoubleFireBonus(gameScreenWidth, gameScreenHeight);

      state.hasBonuses = true;
      doubleFireBonus.nextCreation = timestamp + (doubleFireBonus.creationInterval * Math.random()) + 7000;
    }

    //Create an aim-bonus
    if (aimBonus.nextCreation < timestamp) {
      this.createAimBonus(gameScreenWidth, gameScreenHeight);

      state.hasBonuses = true;
      aimBonus.nextCreation = timestamp + (aimBonus.creationInterval * Math.random()) + 20000;
    }

    //Create an invisible-bonus
    if (invisibleBonus.nextCreation < timestamp) {
      this.createInsivibleBonus(gameScreenWidth, gameScreenHeight);

      state.hasBonuses = true;
      invisibleBonus.nextCreation = timestamp + (invisibleBonus.creationInterval * Math.random()) + 32000;
    }
  }

  //Modify bonuses
  createDoubleFireBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const fireBonusX = gameScreenWidth;
    const fireBonusY = (gameScreenHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['double-fire-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, fireBonusX, fireBonusY, 'Double-fire-bonus', doubleFireUrl, doubleFireBonus.width, doubleFireBonus.height);
  }

  createAimBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const aimBonusX = gameScreenWidth;
    const aimBonusY = (gameScreenHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['aim-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, aimBonusX, aimBonusY, 'Aim-bonus', aimBonusUrl, aimBonus.width, aimBonus.height);
  }

  createInsivibleBonus(gameScreenWidth: number, gameScreenHeight: number) {
    const invisibleBonusX = gameScreenWidth;
    const invisibleBonusY = (gameScreenHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['invisible-bonus', 'bonus'];

    this.sharedService.createEl(classesArr, invisibleBonusX, invisibleBonusY, 'Invisible-bonus', invisibleBonusUrl, invisibleBonus.width, invisibleBonus.height);
  }

  moveAllBonuses(spaceshipEl: any) {
    Array.from(document.getElementsByClassName('bonus'))
      .forEach(bonusEl => {
        let currentPosition = parseInt((bonusEl as HTMLDivElement).style.left);

        if (currentPosition > 0) {
          (bonusEl as HTMLDivElement).style.left = currentPosition - doubleFireBonus.speed + 'px';
        } else {
          bonusEl.remove();
        }

        if (!this.doubleBonusFooterEl) {
          this.setBonusFooterElements();
        }

        if (this.sharedService.hasCollision(spaceshipEl, bonusEl, 6)) {
          //TODO: Impove the check
          if (bonusEl.classList.contains('aim-bonus')) {
            spaceship.bonuses.aim = true;
            this.aimBonusFooterEl.classList.add('footer-img-active');

            spaceshipEl.classList.remove('hide');

            setTimeout(() => {
              spaceship.bonuses.aim = false;
              this.aimBonusFooterEl.classList.remove('footer-img-active');
              spaceshipEl.classList.add('hide');
            }, aimBonus.timeLast);
          } else if (bonusEl.classList.contains('invisible-bonus')) {
            spaceshipEl.style.opacity = '40%';
            this.invisibleBonusFooterEl.classList.add('footer-img-active');

            spaceship.bonuses.invisible = true;

            setTimeout(() => {
              spaceship.bonuses.invisible = false;
              spaceshipEl.style.opacity = '100%';
              this.invisibleBonusFooterEl.classList.remove('footer-img-active');
            }, invisibleBonus.timeLast);
          }
          else {
            spaceship.bonuses.doubleFire = true;
            this.doubleBonusFooterEl.classList.add('footer-img-active');

            setTimeout(() => {
              spaceship.bonuses.doubleFire = false;
              this.doubleBonusFooterEl.classList.remove('footer-img-active');
            }, doubleFireBonus.timeLast);
          }

          bonusEl.remove();
        }
      });
  }
}
