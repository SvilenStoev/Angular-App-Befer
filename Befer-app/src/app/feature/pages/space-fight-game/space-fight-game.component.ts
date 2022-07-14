import { Component, OnInit } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { state, spaceship, availableKeys } from 'src/app/shared/space-fight-game/gameState';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css']
})
export class SpaceFightGameComponent implements OnInit {

  gameStarted: boolean = false;
  gameOver: boolean = false;

  spaceshipEl: any = {};
  gameScreen: any = {};

  constructor(private gameService: SpaceGameService) { }

  ngOnInit(): void {
    this.gameScreen = document.querySelector('.game-view');
  }

  startGame() {
    this.gameStarted = true;
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    this.spaceshipEl = this.gameService.createSpaceship(spaceship.y, spaceship.x);
    this.gameScreen.appendChild(this.spaceshipEl);

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    if (!spaceship.entered) {
      this.spaceshipEnters();
    }

    this.calcSpaceshipPos();

    this.spaceshipEl.style.top = spaceship.y + 'px';
    this.spaceshipEl.style.left = spaceship.x + 'px';

    if (!this.gameOver) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      alert('Game Over!');
    }
  }

  spaceshipEnters(): void {
    if (spaceship.x >= 150) {
      spaceship.entered = true;
    }

    spaceship.x += spaceship.speed;
  }

  calcSpaceshipPos(): void {
    if (spaceship.y >= 0 && (state.keys.KeyW || state.keys.ArrowUp)) {
      spaceship.y -= spaceship.speed;
    }

    if (state.keys.KeyS || state.keys.ArrowDown) {
      spaceship.y += spaceship.speed;
    }

    if (spaceship.x >= 0 && (state.keys.KeyA || state.keys.ArrowLeft)) {
      spaceship.x -= spaceship.speed;
    }

    if (state.keys.KeyD || state.keys.ArrowRight) {
      spaceship.x += spaceship.speed;
    }
  }

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
}
