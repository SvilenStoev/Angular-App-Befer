import { Injectable } from '@angular/core';

import { state, availableKeys } from 'src/app/shared/space-fight-game/gameState';
import { spaceship, alien, bombUrl, bomb, doubleFireBonus, doubleFireUrl, aimBonusUrl, aimBonus, invisibleBonusUrl, invisibleBonus } from 'src/app/shared/space-fight-game/gameObjects';
import { AlienService } from './alien.service';
import { SharedService } from './shared.service';
import { SpaceshipService } from './spaceship.service';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

  spaceshipEl: any = {};
  gameScreenEl: any = {};
  switchShotGun: boolean = false;

  constructor(
    private alienService: AlienService,
    private spaceshipService: SpaceshipService,
    private sharedService: SharedService) { }

  //Initial configuration
  initialStartUp(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.gameScreenEl = document.querySelector('.game-view');
    this.sharedService.gameScreenEl = this.gameScreenEl;
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
    }
  }

  onKeyUp(e: any) {
    if (availableKeys.includes(e.code)) {
      state.keys[e.code as keyof typeof state.keys] = false;
    }
  }

  //Create game objects, modify position and check for collision 
  modifyGameObjects(timestamp: number): void {
    //1. Aliens
    //Create an alien
    if (alien.nextCreation < timestamp) {
      this.alienService.craeteAlien(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
      alien.nextCreation = timestamp + (alien.creationInterval * Math.random()) + 500;
    }

    //Modify aliens position and check for collision
    this.alienService.moveAllAliens(this.spaceshipEl);

    //2. Spaceship
    //Modify spaceship position and check for collision
    this.spaceshipService.calcSpaceshipPos(this.gameScreenEl.offsetWidth, this.gameScreenEl.offsetHeight);
    this.spaceshipService.moveSpaceship();

    //3. Weapon and bombs
    //Fire bombs
    if (state.keys.Space) {
      this.fireBombs(timestamp);
    }

    //Modify bombs position and check for collision
    this.moveAllBombs();

    //4. Bonuses
    //Create random bonuses
    this.createBonuses(timestamp);

    //Move bonuses only if there is bonuses on the screen (because they will be rare)
    if (state.hasBonuses) {
      if (document.getElementsByClassName('bonus').length > 0) {
        this.moveAllBonuses();
      } else {
        state.hasBonuses = false;
      }
    }
  }

  //3. Bombs
  fireBombs(timestamp: number): void {
    if (bomb.nextFire < timestamp) {
      this.createBomb();
      bomb.nextFire = timestamp + bomb.fireInterval;

      if (spaceship.bonuses.doubleFire) {
        this.createBomb();
      }
    }
  }

  //Create and modify bomb
  createBomb(): void {
    const bombX = spaceship.x + (spaceship.width / 3);
    let bombY = (spaceship.y + (spaceship.height / 2));

    if (this.switchShotGun) {
      bombY -= bomb.height;
    }

    this.switchShotGun = !this.switchShotGun;

    this.createEl(['bomb'], bombX, bombY, 'Bomb', bombUrl, bomb.width, bomb.height);
  }

  //Move bombs
  moveAllBombs() {
    Array.from(document.getElementsByClassName('bomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        Array.from(document.getElementsByClassName('alien'))
          .forEach(alienEl => {
            if (this.hasCollision(bombEl, alienEl, 2)) {
              bombEl.remove();
              alienEl.remove();
              state.points += alien.healthPoints;
            }
          });

        if (currentPosition < this.gameScreenEl.offsetWidth) {
          (bombEl as HTMLDivElement).style.left = currentPosition + bomb.speed + 'px';
        } else {
          bombEl.remove();
        }
      });
  }

  //Check for collision
  hasCollision(firstEl: any, secondEl: any, tolerance: number): boolean {
    const first = firstEl.getBoundingClientRect();
    const second = secondEl.getBoundingClientRect();

    const hasCollision = !(first.bottom - tolerance < second.top || first.top + tolerance > second.bottom || first.left + tolerance > second.right || first.right - tolerance < second.left)

    return hasCollision;
  }

  //Other
  createEl(classes: string[], x: number, y: number, imgAlt: string, imgUrl: string, width: number, height: number): any {
    let divEl = document.createElement('div');

    classes.forEach(c => {
      divEl.classList.add(c);
    });

    divEl.style.width = width + 'px';
    divEl.style.height = height + 'px';
    divEl.style.position = 'absolute';
    divEl.style.left = x + 'px';
    divEl.style.top = y + 'px';
    divEl.style.zIndex = '-1';

    let imgEl = document.createElement('img');
    imgEl.alt = imgAlt;
    imgEl.src = imgUrl;

    divEl.appendChild(imgEl);

    this.gameScreenEl.appendChild(divEl);

    return divEl;
  }

  sleep(ms: number) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }

  createBonuses(timestamp: number): void {
    //Create an double-fire-bonus
    //TODO: Check for solution. Timestamp increses even if game is not started yet. If button start game isn't clicked soon after component init th bonuses will be created immediately after game started! 
    if (doubleFireBonus.nextCreation < timestamp) {
      this.createDoubleFireBonus();

      state.hasBonuses = true;
      doubleFireBonus.nextCreation = timestamp + (doubleFireBonus.creationInterval * Math.random()) + 10000;
    }

    //Create an aim-bonus
    if (aimBonus.nextCreation < timestamp) {
      this.createAimBonus();

      state.hasBonuses = true;
      aimBonus.nextCreation = timestamp + (aimBonus.creationInterval * Math.random()) + 20000;
    }

    //Create an invisible-bonus
    if (invisibleBonus.nextCreation < timestamp) {
      this.createInsivibleBonus();

      state.hasBonuses = true;
      invisibleBonus.nextCreation = timestamp + (invisibleBonus.creationInterval * Math.random()) + 30000;
    }
  }

  //4. Modify bonuses
  createDoubleFireBonus() {
    const fireBonusX = this.gameScreenEl.offsetWidth;
    const fireBonusY = (this.gameScreenEl.offsetHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['double-fire-bonus', 'bonus'];

    this.createEl(classesArr, fireBonusX, fireBonusY, 'Double-fire-bonus', doubleFireUrl, doubleFireBonus.width, doubleFireBonus.height);
  }

  createAimBonus() {
    const aimBonusX = this.gameScreenEl.offsetWidth;
    const aimBonusY = (this.gameScreenEl.offsetHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['aim-bonus', 'bonus'];

    this.createEl(classesArr, aimBonusX, aimBonusY, 'Aim-bonus', aimBonusUrl, aimBonus.width, aimBonus.height);
  }

  createInsivibleBonus() {
    const invisibleBonusX = this.gameScreenEl.offsetWidth;
    const invisibleBonusY = (this.gameScreenEl.offsetHeight - doubleFireBonus.height) * Math.random();
    const classesArr = ['invisible-bonus', 'bonus'];

    this.createEl(classesArr, invisibleBonusX, invisibleBonusY, 'Invisible-bonus', invisibleBonusUrl, invisibleBonus.width, invisibleBonus.height);
  }

  moveAllBonuses() {
    Array.from(document.getElementsByClassName('bonus'))
      .forEach(bonusEl => {
        let currentPosition = parseInt((bonusEl as HTMLDivElement).style.left);

        if (currentPosition > 0) {
          (bonusEl as HTMLDivElement).style.left = currentPosition - doubleFireBonus.speed + 'px';
        } else {
          bonusEl.remove();
        }

        if (this.hasCollision(this.spaceshipEl, bonusEl, 6)) {
          //TODO: Impove the check
          if (bonusEl.classList.contains('aim-bonus')) {
            spaceship.bonuses.aim = true;

            this.spaceshipEl.classList.remove('hide');

            setTimeout(() => {
              spaceship.bonuses.aim = false;
              this.spaceshipEl.classList.add('hide');
            }, aimBonus.timeLast);
          } else if (bonusEl.classList.contains('invisible-bonus')) {
            this.spaceshipEl.style.opacity = '40%';
            spaceship.bonuses.invisible = true;

            setTimeout(() => {
              spaceship.bonuses.invisible = false;
              this.spaceshipEl.style.opacity = '100%';
            }, invisibleBonus.timeLast);
          }
          else {
            spaceship.bonuses.doubleFire = true;

            setTimeout(() => {
              spaceship.bonuses.doubleFire = false;
            }, doubleFireBonus.timeLast);
          }

          bonusEl.remove();
        }
      });
  }
}
