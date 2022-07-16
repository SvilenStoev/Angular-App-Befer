import { Injectable } from '@angular/core';

import { state, spaceship, availableKeys, spaceshipUrl } from 'src/app/shared/space-fight-game/gameState';

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
  }

  createSpaceship(): void {
    let starshipEl = document.createElement('div');
    starshipEl.classList.add('spaceship');
    starshipEl.style.position = 'absolute';
    starshipEl.style.left = spaceship.x + 'px';
    starshipEl.style.top = spaceship.y + 'px'; 

    let starshipImg = document.createElement('img');
    starshipImg.alt = 'spaceship';
    starshipImg.src = spaceshipUrl;

    starshipEl.appendChild(starshipImg);

    // <div class="spaceship"><img src="" alt="spaceship"></div>
    
    this.spaceshipEl = starshipEl;
    this.gameScreenEl.appendChild(starshipEl);
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
}
