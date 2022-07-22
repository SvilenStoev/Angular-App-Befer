import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { state, userScores } from 'src/app/shared/space-fight-game/gameState';
import { alien, bossAlien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from 'src/app/services/space-game/shared.service';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';
import { BossGameService } from 'src/app/services/space-game/boss-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit {

  //Game Views
  gameStarted: boolean = false;
  showSettings: boolean = true;
  showStartButton: boolean = true;
  showMenu: boolean = false;
  showAreaWarning: boolean = false;
  showHealthBars: boolean = false;
  showBossEntering: boolean = false;
  showUserScores: boolean = false;

  //Stats
  points: number = state.points;
  level: number = state.level;
  aliensKilled: number = 0;
  spaceshipBoostSpeed: number = 0;
  bossHealth: number = bossAlien.healthPoints;
  spaceshipHealth: number = spaceship.healthPoints;
  userScores: any;

  constructor(
    private gameService: SpaceGameService,
    private bossGameService: BossGameService,
    private sharedService: SharedService) { }

  ngOnInit(): void { }

  async warningAndStartGame() {
    this.showAreaWarning = true;
    this.showStartButton = false;
    this.showSettings = false;

    //await this.sharedService.sleep(5000);

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
      this.aliensKilled = spaceship.aliensKilled;

      if (state.points % 10 == 0) {
        this.points = state.points;
        this.spaceshipBoostSpeed = spaceship.boostSpeed < 0 ? 0 : Number(spaceship.boostSpeed.toFixed());

        this.checkForLevelUpAndSetBossMode();
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      state.openMenu = true;
      this.checkForPauseOrMenu();
      this.gameService.calculateTotalPoints();
      notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
    }
  }

  async gameLoopBoss(timestamp: number) {
    this.bossGameService.modifyGameObjectsBossMode(timestamp);

    if (!state.gameOver) {
      state.points++;

      if (state.points % 10 == 0) {
        this.points = state.points;
        this.bossHealth = bossAlien.healthPoints;
        this.spaceshipHealth = spaceship.healthPoints;

        this.spaceshipBoostSpeed = spaceship.boostSpeed < 0 ? 0 : Number(spaceship.boostSpeed.toFixed());
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      this.bossGameService.calculateTotalPoints();
      this.userScores = userScores;

      if (state.gameWon) {
        notifySuccess(`Great... You have killed the Dev...`);
      } else {
        notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
      }

      this.showUserScores = true;
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

  async checkForLevelUpAndSetBossMode() {
    if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
      this.level = ++state.level;

      if (this.level == 7) {
        notifySuccess(`Congratulation! You have killed almost all aliens!`);
        await this.sharedService.sleep(1000);

        state.isBossMode = true;
        this.showBossEntering = true;
        this.showHealthBars = state.isBossMode;

        await this.sharedService.sleep(5000);

        this.showBossEntering = false;

        //Initializing boss game mode
        this.bossGameService.initialStartUpBossMode();

        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
        return;
      } else {
        notifySuccess(`Congratulation! Level ${state.level} reached!`);
        this.modifyGameDifficulty();
      }

      await this.sharedService.sleep(1100);
    }
  }

  restartGame() {
    if (state.gameOver) {
      Array.from(document.querySelectorAll('.collision-img-game-over')).forEach(c => {
        c.remove();
      });
    }

    this.showMenu = false;
    this.showHealthBars = false;
    this.points = 0;
    this.level = 1;
    this.spaceshipBoostSpeed = 0;
    this.aliensKilled = 0;
    this.bossHealth = bossAlien.initHealthPoints;
    this.spaceshipHealth = spaceship.initHealthPoints;

    this.gameService.onRestart();
    this.startGame();
  }

  pauseGame(): void {
    state.isPaused = true;
    this.showSettings = true;
    document.addEventListener('keypress', this.onResume.bind(this));
  }

  onMenuResume() {
    if (state.gameOver) {
      return;
    }

    state.openMenu = false;
    this.showMenu = false;

    this.checkForPauseOrMenu();
  }

  //TODO: refactor
  onResume(e: any) {
    if (state.isPaused && e.code == 'KeyR') {
      state.isPaused = false;
      this.showSettings = false;

      //TODO: This doesn't remove the event listener!?!??
      document.removeEventListener('keypress', this.onResume);

      //Check for menu also, because event listener doesn't remove..
      if (!state.gameOver && !state.showMenu) {
        if (state.isBossMode) {
          window.requestAnimationFrame(this.gameLoopBoss.bind(this));
        } else {
          window.requestAnimationFrame(this.gameLoop.bind(this));
        }
      }
    }
  }

  modifyGameDifficulty(): void {
    alien.speed++;
    alien.creationInterval -= 500;
  }
}
