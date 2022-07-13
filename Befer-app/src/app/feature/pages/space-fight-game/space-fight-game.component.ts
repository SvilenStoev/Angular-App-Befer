import { Component, OnInit } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css']
})
export class SpaceFightGameComponent implements OnInit {

  gameStarted: boolean = false;
  gameOver: boolean = false;
  state: any = {
    keys: {},
  };

  spaceship: any = {
    x: -180,
    y: 300,
    speed: 5,
    entered: false
  };

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

    this.spaceshipEl = this.gameService.createSpaceship(this.spaceship.y, this.spaceship.x);
    this.gameScreen.appendChild(this.spaceshipEl);

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    if (!this.spaceship.entered) {
      this.spaceshipEnters();
    }

    this.calcSpaceshipPos();

    this.spaceshipEl.style.top = this.spaceship.y + 'px';
    this.spaceshipEl.style.left = this.spaceship.x + 'px';

    if (!this.gameOver) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      alert('Game Over!');
    }
  }

  spaceshipEnters(): void {
    if (this.spaceship.x >= 150) {
      this.spaceship.entered = true;
    }

    this.spaceship.x += this.spaceship.speed;
  }

  calcSpaceshipPos(): void {

    if (this.spaceship.y >= 0 && (this.state.keys.KeyW || this.state.keys.ArrowUp)) {
      this.spaceship.y -= this.spaceship.speed;
    }

    if (this.state.keys.KeyS || this.state.keys.ArrowDown) {
      this.spaceship.y += this.spaceship.speed;
    }

    if (this.spaceship.x >= 0 && (this.state.keys.KeyA || this.state.keys.ArrowLeft)) {
      this.spaceship.x -= this.spaceship.speed;
    }

    if (this.state.keys.KeyD || this.state.keys.ArrowRight) {
      this.spaceship.x += this.spaceship.speed;
    }
  }

  onKeyDown(e: any) {
    this.state.keys[e.code] = true;
  }

  onKeyUp(e: any) {
    this.state.keys[e.code] = false;
  }
}
