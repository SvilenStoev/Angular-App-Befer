import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpaceGameService {

  constructor() { }

  createSpaceship(posY: number, posX: number): any {
    console.log("spaceship created");
    let starshipEl = document.createElement('div');
    starshipEl.classList.add('spaceship');
    starshipEl.style.position = 'absolute';
    starshipEl.style.left = posX + 'px';
    starshipEl.style.top = posY + 'px';

    let starshipImg = document.createElement('img');
    starshipImg.src = '../../../../assets/images/spaceship.png';
    starshipImg.alt = 'spaceship';

    starshipEl.appendChild(starshipImg);


    // <div class="spaceship"><img src="" alt="spaceship"></div>
    

    return starshipEl;
  }

}
