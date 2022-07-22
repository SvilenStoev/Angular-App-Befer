import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { state, userScores } from 'src/app/shared/space-fight-game/gameState';
import { alien, bossAlien, spaceship } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from 'src/app/services/space-game/shared.service';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';
import { BossGameService } from 'src/app/services/space-game/boss-game.service';
import { GameApiService } from 'src/app/services/space-game/api/game-api.service';

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
  showUsersScores: boolean = false;

  //Stats
  points: number = state.points;
  level: number = state.level;
  aliensKilled: number = 0;
  spaceshipBoostSpeed: number = 0;
  bossHealth: number = bossAlien.healthPoints;
  spaceshipHealth: number = spaceship.healthPoints;
  userScores: any;

  //API
  lastBestUserPoints: number;
  lastScoresId: string;
  currUserUsername: string;
  currUserFullName: string;
  usersScores: any;

  constructor(
    private gameService: SpaceGameService,
    private bossGameService: BossGameService,
    private sharedService: SharedService,
    private gameApiService: GameApiService) { }

  ngOnInit(): void { }

  //This is called only once when game is started. It is not called on restart!
  async warningAndStartGame() {
    this.showAreaWarning = true;
    this.showStartButton = false;
    this.showSettings = false;

    //Get curr user scores from the database
    this.getCurrUserScores();

    await this.sharedService.sleep(5000);

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

        //TODO: Refactor this. Return happents in the method
        if (await this.checkForLevelUpAndSetBossMode()) {
          return;
        }
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      this.onGameOver();
      notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
    }
  }

  gameLoopBoss(timestamp: number) {
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
      this.onGameOver();

      if (state.gameWon) {
        notifySuccess(`Great... You have killed the Dev...`);
      } else {
        notifyErr(`Game Over! ${userScores.totalPoints} points reached.`);
      }
    }
  }

  onGameOver() {
    this.gameService.calculateTotalPoints();
    this.userScores = userScores;
    this.showUserScores = true;

    if (!this.lastBestUserPoints) {
      this.gameApiService.createScores$(userScores as any).subscribe({
        next: () => {

        },
        complete: () => {
          console.log('Created scores', userScores.totalPoints);
        },
        error: () => {
          console.log('Error');
        }
      });
    } else {
      //If have current scores and they are lower than the new ones -> update database.
      if (userScores.totalPoints >= this.lastBestUserPoints) {
        this.gameApiService.updateScores$(userScores as any, this.lastScoresId).subscribe({
          next: () => {

          },
          complete: () => {
            console.log(`Updated scores! Last: ${this.lastBestUserPoints}, now: ${userScores.totalPoints}`);
          },
          error: () => {
            console.log('Error');
          }
        });
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

  async checkForLevelUpAndSetBossMode(): Promise<boolean> {
    if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
      this.level = ++state.level;

      if (this.level == 7) {
        notifySuccess(`Congratulation! You have killed almost all aliens!`);

        state.isBossMode = true;
        this.showBossEntering = true;
        this.showHealthBars = state.isBossMode;

        Array.from(document.getElementsByClassName('alien')).forEach(alienEl => {
          alienEl.remove();
        });

        await this.sharedService.sleep(5000);

        this.showBossEntering = false;

        //Initializing boss game mode
        this.bossGameService.initialStartUpBossMode();

        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
        return true;
      } else {
        notifySuccess(`Congratulation! Level ${state.level} reached!`);
        this.modifyGameDifficulty();
      }

      await this.sharedService.sleep(1100);
    }

    return false;
  }

  restartGame() {
    //Gets the best scores again!
    this.getCurrUserScores();

    if (state.gameOver) {
      Array.from(document.querySelectorAll('.collision-img-game-over')).forEach(c => {
        c.remove();
      });
    }

    this.showMenu = false;
    this.showUserScores = false;
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

  onMenuScores(): void {
    this.gameApiService.loadAllScores$(5).subscribe({
      next: (data) => {
        this.usersScores = data.results;
        console.log(this.usersScores);
      },
      complete: () => {

      },
      error: () => {

      }
    });

    this.showUsersScores = true;
    this.showMenu = false;

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
  onResume(e: any, showMenu: boolean = false) {
    if (showMenu) {
      this.showMenu = showMenu;
      return;
    }

    if (state.openMenu) {
      this.showMenu = true;
    }

    if (state.isPaused && e.code == 'KeyR') {
      state.isPaused = false;
      this.showSettings = false;

      //TODO: This doesn't remove the event listener!?!??
      document.removeEventListener('keypress', this.onResume);

      //Check for menu also, because event listener doesn't remove..
      if (!state.gameOver && !state.openMenu) {
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

  //API
  getCurrUserScores() {
    this.gameApiService.loadMyScores$(5).subscribe({
      next: (res) => {
        const data = res.results;

        this.lastBestUserPoints = data[0]?.totalPoints;
        this.currUserUsername = data[0]?.player.username;
        this.currUserFullName = data[0]?.player.fullName;
        this.lastScoresId = data[0]?.objectId;
      },
      complete: () => {

      },
      error: () => {

      }
    });
  }
}
