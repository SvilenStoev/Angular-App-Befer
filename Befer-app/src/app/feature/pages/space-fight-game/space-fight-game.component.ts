import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { state, spaceship, alien, bomb } from 'src/app/shared/space-fight-game/gameState';
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

  async startGame() {
    this.gameStarted = true;
    this.gameService.initialStartUp();

    await this.gameService.sleep(1200);

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  async gameLoop(timestamp: number) {
    //Create an alien
    if (alien.nextCreation < timestamp) {
      this.gameService.craeteAlien();
      alien.nextCreation = timestamp + (alien.creationInterval * Math.random()) + 500;
    }

    this.gameService.moveAllAliens();

    //Modify spaceship position
    this.gameService.calcSpaceshipPos();
    this.gameService.moveSpaceship();

    //Fire bombs
    if (state.keys.Space) {
      this.gameService.fireBombs(timestamp);
    }

    //Move bombs
    this.gameService.moveAllBombs();

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
