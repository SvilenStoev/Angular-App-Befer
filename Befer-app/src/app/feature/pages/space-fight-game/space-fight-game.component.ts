import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifySuccess } from 'src/app/shared/other/notify';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { alien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from 'src/app/services/space-game/shared.service';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit {

  //Views
  gameStarted: boolean = false;
  showSettings: boolean = true;
  showMenu: boolean = false;
  showAreaWarning: boolean = false;
  showStartButton: boolean = true;

  points: number = state.points;
  level: number = state.level;
  spaceshipBoostSpeed: number = 0;

  constructor(private gameService: SpaceGameService,
    private sharedService: SharedService) { }

  ngOnInit(): void {

  }

  async warningAndStartGame() {
    this.showAreaWarning = true;
    this.showStartButton = false;
    this.showSettings = false;

    await this.sharedService.sleep(4000);

    this.showAreaWarning = false;

    this.startGame();
  }

  async startGame() {
    this.gameStarted = true;

    this.gameService.initialStartUp();

    await this.sharedService.sleep(1000);

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
            await this.sharedService.sleep(1200);
            state.isBossMode = true;

            //Initializing boss game mode
            this.gameService.initialStartUpBossMode();

            window.requestAnimationFrame(this.gameLoopBoss.bind(this));
            return;
          } else {
            notifySuccess(`Congratulation! Level ${state.level} reached!`);
            this.modifyGameDifficulty();
          }

          await this.sharedService.sleep(1200);
        }
      }

      //Pause & menu
      this.checkForPauseOrMenu();
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
        this.spaceshipBoostSpeed = spaceship.boostSpeed < 0 ? 0 : Number(spaceship.boostSpeed.toFixed());
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      console.log('game over!', state.points);
    }
  }

  checkForPauseOrMenu() {
    if (!state.isPaused && !state.openMenu) {
      if (state.isBossMode) {
        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
      } else {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      }
    } else if (state.isPaused) {
      this.pauseGame();
    } else {
      this.showMenu = true;
    }
  }

  restartGame() {
    this.showMenu = false;
    this.points = 0;
    this.level = 1;
    this.spaceshipBoostSpeed = 0;

    this.gameService.onRestart();
    this.startGame();
  }

  pauseGame(): void {
    this.showSettings = true;
    document.addEventListener('keypress', this.onResume.bind(this));
  }

  onMenuResume() {
    state.openMenu = false;
    this.showMenu = false;

    this.checkForPauseOrMenu();
  }

  //TODO: refactor
  onResume(e: any) {
    if (state.isPaused && e.code == 'KeyR') {
      state.isPaused = false;
      this.showSettings = false;

      //TODO: This doesn't remove the event listener!?!
      document.removeEventListener('keypress', this.onResume);

      if (state.isBossMode) {
        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
      } else {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      }
    }
  }

  modifyGameDifficulty(): void {
    alien.speed++;
    alien.creationInterval -= 500;
  }
}
