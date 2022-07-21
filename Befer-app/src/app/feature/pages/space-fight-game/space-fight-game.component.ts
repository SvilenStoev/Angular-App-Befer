import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { state, userScores } from 'src/app/shared/space-fight-game/gameState';
import { alien, bossAlien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
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
  showHealthBars: boolean = false;
  showBossEntering: boolean = false;

  points: number = state.points;
  level: number = state.level;
  aliensKilled: number = spaceship.aliensKilled;
  spaceshipBoostSpeed: number = 0;
  bossHealth: number = bossAlien.healthPoints;
  spaceshipHealth: number = spaceship.healthPoints;
  timeRemaining: number = 0;

  constructor(private gameService: SpaceGameService,
    private sharedService: SharedService) { }

  ngOnInit(): void {

  }

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

        if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
          this.level = ++state.level;

          if (this.level == 7) {
            notifySuccess(`Congratulation! You have killed almost all aliens!`);
            await this.sharedService.sleep(1000);

            state.isBossMode = true;
            this.showBossEntering = true;
            this.showHealthBars = state.isBossMode;

            await this.sharedService.sleep(4000);

            this.showBossEntering = false;

            //Initializing boss game mode
            this.gameService.initialStartUpBossMode();

            const timeEl = document.querySelector('#remaining-time');
            this.startTimerForBossMode(600, timeEl);

            window.requestAnimationFrame(this.gameLoopBoss.bind(this));
            return;
          } else {
            notifySuccess(`Congratulation! Level ${state.level} reached!`);
            this.modifyGameDifficulty();
          }

          await this.sharedService.sleep(1100);
        }
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      state.openMenu = true;
      this.checkForPauseOrMenu();
      this.calculateTotalPoints();
      notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
    }
  }

  async gameLoopBoss(timestamp: number) {
    this.gameService.modifyGameObjectsBossMode(timestamp);

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
      state.openMenu = true;

      this.checkForPauseOrMenu();

      if (state.gameWon) {
        this.calculateTotalPoints();
        notifySuccess(`Great... You have killed the Dev...`);
      } else {
        this.calculateTotalPoints();
        notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
      }
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

  async restartGame() {
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
    this.bossHealth = bossAlien.initHealthPoints;
    this.spaceshipHealth = spaceship.initHealthPoints;

    //If game over and restart game sometimes it take too long querySelector to find the collision img and don't remove it before gameOver setting to false! 
    this.sharedService.sleep(300);

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

  calculateTotalPoints(): void {
    const totalPoints = state.points;
    const pointsFromRemBoost = this.spaceshipBoostSpeed * 10000 / 100;
    const pointsFromAliensKilled = this.aliensKilled * 100;
    const pointsFromTime = Math.floor(userScores.timeRemaining * 5000 / 60);

    userScores.totalPoints = totalPoints + pointsFromRemBoost + pointsFromAliensKilled + pointsFromTime;
    console.log(totalPoints, pointsFromRemBoost, pointsFromAliensKilled, pointsFromTime);
  }

  startTimerForBossMode(duration: number, timeEl: any) {
    const start = Date.now();

    function timer() {
      const diff = duration - (((Date.now() - start) / 1000) | 0);

      userScores.timeRemaining = diff;

      let minutes = (diff / 60) | 0;
      let seconds = (diff % 60) | 0;

      let minStr = (minutes < 10 ? '0' + minutes : minutes).toString();
      let secStr = (seconds < 10 ? '0' + seconds : seconds).toString();

      timeEl.textContent = minStr + ':' + secStr;

      if (minutes <= 0 && seconds <= 0) {
        state.gameOver = true;
        clearInterval(refreshIntervalId);
        return;
      }
    };

    timer();
    let refreshIntervalId = setInterval(timer, 1000);
  }

  modifyGameDifficulty(): void {
    alien.speed++;
    alien.creationInterval -= 500;
  }
}
