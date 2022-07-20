import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifySuccess } from 'src/app/shared/other/notify';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { alien, spaceship, bossAlienUrl, bossAlien } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from 'src/app/services/space-game/shared.service';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit {

  gameStarted: boolean = false;
  showSettings: boolean = true;
  points: number = state.points;
  level: number = state.level;
  spaceshipBoostSpeed: number = 0;

  constructor(private gameService: SpaceGameService,
    private sharedService: SharedService) { }

  ngOnInit(): void {

  }

  async startGame() {
    this.gameStarted = true;
    this.showSettings = false;
    this.gameService.initialStartUp();

    await this.sharedService.sleep(1200);

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  async gameLoop(timestamp: number) {
    //Create game objects, modify position and check for collision 
    this.gameService.modifyGameObjects(timestamp);

    if (!state.gameOver) {
      state.points++;

      if (state.points % 10 == 0) {
        this.points = state.points;
        this.spaceshipBoostSpeed = spaceship.boostSpeed < 0 ? 0 : Number(spaceship.boostSpeed.toFixed());

        if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
          this.level = ++state.level;

          if (this.level == 7) {
            notifySuccess(`Congratulation! You have killed almost all aliens!`);
            await this.sharedService.sleep(1500);

            this.gameService.initialStartUpBossMode();

            window.requestAnimationFrame(this.gameLoopBoss.bind(this));
            return;
          } else {
            notifySuccess(`Congratulation! Level ${state.level} reached!`);
            this.modifyGameDifficulty();
          }

          await this.sharedService.sleep(1500);
        }
      }

      //Pause game
      if (!state.isPaused) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      } else {
        this.pauseGame();
      }
    } else {
      console.log('game over!', state.points);
    }
  }

  gameLoopBoss(timestamp: number) {
    this.gameService.modifyGameObjectsBossMode(timestamp);

    if (!state.gameOver) {
      state.points++;

      if (state.points % 10 == 0) {
        this.points = state.points;
        this.spaceshipBoostSpeed = Number(spaceship.boostSpeed.toFixed());
      }

      //Pause game
      if (!state.isPaused) {
        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
      } else {
        this.pauseGame();
      }
    } else {
      console.log('game over!', state.points);
    }
  }

  pauseGame(): void {
    this.showSettings = true;
    document.addEventListener('keypress', this.onResume.bind(this));
  }

  //TODO: refactor
  onResume(e: any) {
    if (state.isPaused && e.code == 'KeyR') {
      state.isPaused = false;
      this.showSettings = false;

      //TODO: This doesn't remove the event listener!?!
      document.removeEventListener('keypress', this.onResume);

      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  modifyGameDifficulty(): void {
    alien.speed++;
    alien.creationInterval -= 500;
  }
}
