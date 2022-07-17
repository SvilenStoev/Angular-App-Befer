import { Injectable } from '@angular/core';

import { state, spaceship, availableKeys, spaceshipUrl, alien, alienUrl, bombUrl, bomb } from 'src/app/shared/space-fight-game/gameState';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

  spaceshipEl: any = {};
  gameScreenEl: any = {};

  constructor() { }

  //Initial configuration
  initialStartUp(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.gameScreenEl = document.querySelector('.game-view');
    this.createSpaceship();
    this.spaceshipEntering();
  }

  createSpaceship(): void {
    this.spaceshipEl = this.createEl('spaceship', spaceship.x, spaceship.y, 'Spaceship', spaceshipUrl);
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

  //Create and modify alien
  craeteAlien(): void {
    const alienX = this.gameScreenEl.offsetWidth;
    const alienY = (this.gameScreenEl.offsetHeight - alien.height) * Math.random();

    this.createEl('alien', alienX, alienY, 'Alien', alienUrl);
  }

  fireBombs(timestamp: number): void {
    if (bomb.nextFire < timestamp) {
      this.craeteBomb();
      bomb.nextFire = timestamp + bomb.fireInterval;
    }
  }

  //Create and modify bomb
  craeteBomb(): void {
    const bombX = spaceship.x + (spaceship.width / 2);
    const bombY = (spaceship.y + (spaceship.height / 2) - bomb.height / 2);

    this.createEl('bomb', bombX, bombY, 'Bomb', bombUrl);
  }

  //Move alien
  moveAllAliens(): void {
    Array.from(document.getElementsByClassName('alien'))
      .forEach(alienEl => {
        let currentPosition = parseInt((alienEl as HTMLDivElement).style.left);

        if (this.hasCollision(this.spaceshipEl, alienEl)) {
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

  //Move bombs
  moveAllBombs() {
    Array.from(document.getElementsByClassName('bomb'))
      .forEach(bombEl => {
        let currentPosition = parseInt((bombEl as HTMLDivElement).style.left);

        Array.from(document.getElementsByClassName('alien'))
          .forEach(alienEl => {
            if (this.hasCollision(bombEl, alienEl)) {
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
  hasCollision(firstEl: any, secondEl: any): boolean {
    const first = firstEl.getBoundingClientRect();
    const second = secondEl.getBoundingClientRect();

    const hasCollision = !(first.bottom - 10 < second.top || first.top + 10 > second.bottom || first.left + 10 > second.right || first.right - 10 < second.left)

    return hasCollision;
  }

  displayCollisionImg() {
    const collEl = document.createElement('div');
    const img = document.createElement('img');
    img.src = '../../../../assets/images/collision.png';
    collEl.appendChild(img);

    collEl.style.position = 'absolute';
    collEl.style.left = spaceship.x + 61 + 'px';
    collEl.style.top = spaceship.y - 16 + 'px';

    this.gameScreenEl.appendChild(collEl);
  }

  //Other
  createEl(className: string, x: number, y: number, imgAlt: string, imgUrl: string): any {
    let divEl = document.createElement('div');
    divEl.classList.add(className);
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
}
