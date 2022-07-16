import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { state, spaceship, alien } from 'src/app/shared/space-fight-game/gameState';

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

  gameLoop(timestamp: number) {
    if (!spaceship.entered) {
      this.gameService.spaceshipEntering();
    } else {
      
      //Create an alien
      if (alien.nextCreation < timestamp) {
        this.gameService.craeteAlien();
        alien.nextCreation = timestamp + (alien.creationInterval * Math.random()) + 500;
      }

      this.gameService.moveAllAliens();
    }

    this.gameService.calcSpaceshipPos();
    this.gameService.moveSpaceship();

    this.gameOver = state.gameOver;
    
    if (!this.gameOver) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      alert('Game Over!');
    }
  }
}
