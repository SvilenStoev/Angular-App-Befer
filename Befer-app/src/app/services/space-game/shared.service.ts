import { Injectable } from '@angular/core';
import { collisionUrl, spaceship } from 'src/app/shared/space-fight-game/gameObjects';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  gameScreenEl: any;

  constructor() { }

  createEl(classes: string[], x: number, y: number, imgAlt: string, imgUrl: string, width: number, height: number): HTMLDivElement {
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

  sleep(ms: number) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
}
