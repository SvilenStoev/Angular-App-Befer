import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { state, spaceship, alien } from 'src/app/shared/space-fight-game/gameState';
import { notifySuccess } from 'src/app/shared/other/notify';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit {

  gameStarted: boolean = false;
  points: number = state.points;
  level: number = state.level;

  constructor(private gameService: SpaceGameService) { }

  ngOnInit(): void {

  }

  startGame() {
    this.gameStarted = true;
    this.gameService.initialStartUp();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  async gameLoop(timestamp: number) {
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

    if (!state.gameOver) {
      state.points++;

      if (state.points % 10 == 0) {
        this.points = state.points;

        if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
          this.level = ++state.level;
          notifySuccess(`Congratulation! Level ${state.level} reached!`);
          await this.gameService.sleep(2500);
        }
      }

      window.requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      console.log('game over!', state.points);
    }
  }
}
