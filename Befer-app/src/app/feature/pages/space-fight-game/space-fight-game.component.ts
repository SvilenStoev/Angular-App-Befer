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
  spaceship: any = {};
  gameScreen: any = {};

  constructor(private gameService: SpaceGameService) { }

  ngOnInit(): void {
    this.gameScreen = document.querySelector('.game-view');
  }

  startGame() {
    this.gameStarted = true;
    this.spaceship = this.gameService.createSpaceship(200, 100);
    this.gameScreen.appendChild(this.spaceship);

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    console.log('loop');

    if (!this.gameOver) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      alert('Game Over!');
    }

  }

}
