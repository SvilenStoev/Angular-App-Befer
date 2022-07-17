import { Injectable } from '@angular/core';

import { state, availableKeys } from 'src/app/shared/space-fight-game/gameState';
import { spaceship, spaceshipUrl, alien, alienUrl, bombUrl, bomb, doubleFireBonus, doubleFireUrl, collisionUrl, aimBonusUrl, aimBonus } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

  spaceshipEl: any = {};
  gameScreenEl: any = {};
  switchShotGun: boolean = false;

  constructor() { }

  //Initial configuration
  initialStartUp(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.gameScreenEl = document.querySelector('.game-view');
    this.createSpaceship();
    this.spaceshipEntering();
  }

  //Track user keyboard input
  onKeyDown(e: any) {
    if (availableKeys.includes(e.code)) {
      state.keys[e.code as keyof typeof state.keys] = true;
    }
  }

  onKeyUp(e: any) {
    if (availableKeys.includes(e.code)) {
      state.keys[e.code as keyof typeof state.keys] = false;
    }
  }

  //1. Spaceship
  createSpaceship(): void {
    this.spaceshipEl = this.createEl(['spaceship', 'hide'], spaceship.x, spaceship.y, 'Spaceship', spaceshipUrl, spaceship.width, spaceship.height);
  }

  //Modify spaceship possition
  async spaceshipEntering() {
    while (spaceship.x < 150) {
      spaceship.x += spaceship.speed;
      this.moveSpaceship();

      await this.sleep(15);
    }
  }

  calcSpaceshipPos(): void {
    if ((state.keys.KeyW || state.keys.ArrowUp) && spaceship.y > 0) {
      spaceship.y -= spaceship.speed;
    }

    if ((state.keys.KeyS || state.keys.ArrowDown) && spaceship.y + spaceship.height + 10 < this.gameScreenEl.offsetHeight) {
      spaceship.y += spaceship.speed;
    }

    if ((state.keys.KeyA || state.keys.ArrowLeft) && spaceship.x > 0) {
      spaceship.x -= spaceship.speed;
    }

    if ((state.keys.KeyD || state.keys.ArrowRight) && spaceship.x + spaceship.width + 50 < this.gameScreenEl.offsetWidth) {
      spaceship.x += spaceship.speed;
    }
  }

  moveSpaceship(): void {
    this.spaceshipEl.style.top = spaceship.y + 'px';
    this.spaceshipEl.style.left = spaceship.x + 'px';
  }

  //2. Alien
  craeteAlien(): void {
    const alienX = this.gameScreenEl.offsetWidth;
    const alienY = (this.gameScreenEl.offsetHeight - alien.height) * Math.random();

    this.createEl(['alien'], alienX, alienY, 'Alien', alienUrl, alien.width, alien.height);
  }

  //Move alien
  moveAllAliens(): void {
    Array.from(document.getElementsByClassName('alien'))
      .forEach(alienEl => {
        let currentPosition = parseInt((alienEl as HTMLDivElement).style.left);

        if (this.hasCollision(this.spaceshipEl, alienEl, 12)) {
          state.gameOver = true;
          this.displayCollisionImg();
        }

        if (currentPosition > -80) {
          (alienEl as HTMLDivElement).style.left = currentPosition - alien.speed + 'px';
        } else {
          alienEl.remove();
        }
      });
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
            if (this.hasCollision(bombEl, alienEl, 6)) {
              bombEl.remove();
              alienEl.remove();
              state.points += alien.pointsToKill;
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

  displayCollisionImg() {
    const collEl = document.createElement('div');
    const img = document.createElement('img');
    img.src = collisionUrl;
    collEl.appendChild(img);

    collEl.style.position = 'absolute';
    collEl.style.left = spaceship.x + 39 + 'px';
    collEl.style.top = spaceship.y - 16 + 'px';

    this.gameScreenEl.appendChild(collEl);
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
          } else {
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
