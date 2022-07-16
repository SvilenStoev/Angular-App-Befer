import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { spaceship } from 'src/app/shared/space-fight-game/gameState';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit {

  gameStarted: boolean = false;
  gameOver: boolean = false;

  constructor(private gameService: SpaceGameService) { }

  ngOnInit(): void {
    
  }

  startGame() {
    this.gameStarted = true;
    this.gameService.initialStartUp();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    if (!spaceship.entered) {
      this.spaceshipEnters();
    }

    this.gameService.calcSpaceshipPos();
    this.gameService.moveSpaceship();

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

}
