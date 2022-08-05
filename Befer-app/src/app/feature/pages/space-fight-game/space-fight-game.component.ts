import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { UserService } from 'src/app/services/auth/user.service';
import { gameState } from 'src/app/shared/space-fight-game/gameState';
import { objects } from 'src/app/shared/space-fight-game/gameObjects';
import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { ReplaceArgsPipe } from 'src/app/shared/pipes/replace-args.pipe';
import { LanguageService } from 'src/app/services/common/language.service';
import { SharedService } from 'src/app/services/space-game/shared.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { BossGameService } from 'src/app/services/space-game/boss-game.service';
import { GameApiService } from 'src/app/services/space-game/api/game-api.service';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceFightGameComponent implements OnInit, OnDestroy {

  //Game Views
  gameStarted: boolean = false;
  showSettings: boolean = false;
  showStartButton: boolean = false;
  showSmallScreenWarning: boolean = false;
  showMenu: boolean = false;
  showAreaWarning: boolean = false;
  showHealthBars: boolean = false;
  showBossEntering: boolean = false;
  showUserScores: boolean = false;
  showUsersScores: boolean = false;
  showWonView: boolean = false;

  //Stats
  points: number = gameState.state.points;
  level: number = gameState.state.level;
  aliensKilled: number = 0;
  aliensMissed: number = 0;
  spaceshipBoostSpeed: number = 0;
  bossHealth: number = objects.bossAlien.healthPoints;
  spaceshipHealth: number = objects.spaceship.healthPoints;
  userScores: any;

  //API related
  lastBestUserPoints: number;
  lastScoresId: string;
  currUserUsername: string;
  currUserFullName: string;
  usersScores: any;

  //Language
  menu: any = this.langService.get().spaceFightGame;
  subscription: Subscription;

  constructor(
    private gameService: SpaceGameService,
    private bossGameService: BossGameService,
    private sharedService: SharedService,
    private gameApiService: GameApiService,
    private userService: UserService,
    private titleService: TabTitleService,
    private langService: LanguageService,
    private replaceArgs: ReplaceArgsPipe) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.spaceFightGame;
      this.setTitle();
    });

    //Warning if user try to play on screen smaller than 1300px width, or 800px height.
    if (screen.width < 1300 || screen.height < 800) {
      console.log(`Screen width: ${screen.width}, Screen height: ${screen.height}`);
      this.showSmallScreenWarning = true;
    } else {
      this.showSettings = true;
      this.showStartButton = true;
    }
  }

  //This is called only once when game is started. It is not called on restart!
  async warningAndStartGame() {
    this.showStartButton = false;
    this.showSettings = false;

    this.showAreaWarning = true;

    //Get curr user scores from the database
    this.getCurrUserAndScores();
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
    this.aliensKilled = objects.spaceship.aliensKilled;
    this.aliensMissed = objects.spaceship.aliensMissed;

    if (!gameState.state.gameOver) {
      gameState.state.points++;

      if (gameState.state.points % 10 == 0) {
        this.points = gameState.state.points;
        this.spaceshipBoostSpeed = objects.spaceship.boostSpeed < 0 ? 0 : Number(objects.spaceship.boostSpeed.toFixed());

        //TODO: Refactor this. Return happents in the method
        if (await this.checkForLevelUpAndSetBossMode(timestamp)) {
          return;
        }
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      this.onGameOver();
      notifyErr(this.replaceArgs.transform(this.menu.messages.gameOver, gameState.userScores.totalPoints));
    }
  }

  gameLoopBoss(timestamp: number) {
    this.bossGameService.modifyGameObjectsBossMode(timestamp);
    this.bossHealth = objects.bossAlien.healthPoints;
    this.spaceshipHealth = objects.spaceship.healthPoints;

    if (!gameState.state.gameOver) {
      gameState.state.points++;

      if (gameState.state.points % 10 == 0) {
        this.points = gameState.state.points;
        this.spaceshipBoostSpeed = objects.spaceship.boostSpeed < 0 ? 0 : Number(objects.spaceship.boostSpeed.toFixed());
      }

      //Pause & menu
      this.checkForPauseOrMenu();
    } else {
      this.onGameOver();

      if (gameState.state.gameWon) {
        notifySuccess(this.menu.messages.gameOverWon);
      } else {
        notifyErr(this.replaceArgs.transform(this.menu.messages.gameOver, gameState.userScores.totalPoints));
      }
    }
  }

  async onGameOver() {
    this.gameService.calculateTotalPoints();
    this.userScores = gameState.userScores;

    this.updateDatabaseUserScores();

    if (gameState.state.gameWon) {
      this.showWonView = true;
    } else {
      this.showUserScores = true;
    }
  }

  goToScores() {
    this.showWonView = false;
    this.showUserScores = true;
  }

  checkForPauseOrMenu() {
    if (!gameState.state.isPaused && !gameState.state.openMenu) {
      if (gameState.state.isBossMode) {
        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
      } else {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      }
    } else if (gameState.state.isPaused) {
      this.pauseGame();
    } else {
      this.showMenu = true;
    }
  }

  async checkForLevelUpAndSetBossMode(timestamp: number): Promise<boolean> {
    if (gameState.state.points >= gameState.state.levelsRange[(gameState.state.level + 1) as keyof typeof gameState.state.levelsRange]) {
      this.level = ++gameState.state.level;

      if (this.level == 7) {
        notifySuccess(this.menu.messages.level7);

        gameState.state.isBossMode = true;
        this.showBossEntering = true;
        this.showHealthBars = gameState.state.isBossMode;

        Array.from(document.getElementsByClassName('alien')).forEach(alienEl => {
          alienEl.remove();
        });

        (document.querySelector('footer') as HTMLElement).style.display = 'none';

        await this.sharedService.sleep(5000);

        this.showBossEntering = false;

        //Initializing boss game mode
        this.bossGameService.initialStartUpBossMode(timestamp);

        window.requestAnimationFrame(this.gameLoopBoss.bind(this));
        return true;
      } else {
        notifySuccess(this.replaceArgs.transform(this.menu.messages.levelUp, gameState.state.level));
        this.modifyGameDifficulty();
      }

      await this.sharedService.sleep(1100);
    }

    return false;
  }

  restartGame() {
    //Gets the best scores again!
    this.getCurrUserAndScores();

    if (gameState.state.gameOver) {
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
    this.aliensMissed = 0;
    this.bossHealth = objects.bossAlien.initHealthPoints;
    this.spaceshipHealth = objects.spaceship.initHealthPoints;

    this.gameService.onRestart();
    this.startGame();
  }

  pauseGame(): void {
    gameState.state.isPaused = true;
    this.showSettings = true;
    document.addEventListener('keypress', this.onResume.bind(this));
  }

  onMenuScores(): void {
    this.gameApiService.loadAllScores$(10).subscribe({
      next: (data) => {
        this.usersScores = (data.results as Array<any>).sort((a, b) => b.totalPoints - a.totalPoints);
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
    if (gameState.state.gameOver) {
      notifyErr(this.menu.messages.gameOverResume);
      return;
    }

    gameState.state.openMenu = false;
    this.showMenu = false;

    this.checkForPauseOrMenu();
  }

  backToMenu() {
    this.showMenu = true;
    this.showUserScores = false;
    this.showUsersScores = false;
  }

  //TODO: refactor
  onResume(e: any) {
    if (gameState.state.openMenu) {
      this.showMenu = true;
    }

    if (gameState.state.isPaused && e.code == 'KeyR') {
      gameState.state.isPaused = false;
      this.showSettings = false;

      //TODO: This doesn't remove the event listener!?!??
      document.removeEventListener('keypress', this.onResume);

      //Check for menu also, because event listener doesn't remove..
      if (!gameState.state.gameOver && !gameState.state.openMenu) {
        if (gameState.state.isBossMode) {
          window.requestAnimationFrame(this.gameLoopBoss.bind(this));
        } else {
          window.requestAnimationFrame(this.gameLoop.bind(this));
        }
      }
    }
  }

  modifyGameDifficulty(): void {
    objects.alien.speed++;
    objects.alien.creationInterval -= 500;
  }

  //API
  getCurrUserAndScores() {
    this.userService.getProfile$().subscribe({
      next: (user) => {
        this.currUserUsername = user?.username;
        this.currUserFullName = user?.fullName;
      }
    });

    this.gameApiService.loadMyScores$(5).subscribe({
      next: (res) => {
        const data = res.results;

        this.lastBestUserPoints = data[0]?.totalPoints;
        this.lastScoresId = data[0]?.objectId;
      },
      error: () => {
        console.log('Some error!');
      }
    });
  }

  updateDatabaseUserScores() {
    if (!this.lastBestUserPoints) {
      this.gameApiService.createScores$(gameState.userScores as any).subscribe({
        next: () => {

        },
        complete: () => {
          console.log('Created scores', gameState.userScores.totalPoints);
        },
        error: () => {
          console.log('Error');
        }
      });
    } else {
      //If there are current scores and they are lower than the new ones -> update database.
      if (gameState.userScores.totalPoints >= this.lastBestUserPoints) {
        this.gameApiService.updateScores$(gameState.userScores as any, this.lastScoresId).subscribe({
          next: () => {

          },
          complete: () => {
            console.log(`Updated scores! Last: ${this.lastBestUserPoints}, now: ${gameState.userScores.totalPoints}`);
          },
          error: () => {
            console.log('Error');
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
