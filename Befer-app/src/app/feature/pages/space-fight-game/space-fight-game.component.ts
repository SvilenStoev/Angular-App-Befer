import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifySuccess } from 'src/app/shared/other/notify';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SpaceGameService } from 'src/app/services/components/space-game.service';
import { doubleFireBonus, alien, spaceship, aimBonus, invisibleBonus } from 'src/app/shared/space-fight-game/gameObjects';
import { timeout } from 'rxjs';

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

    this.createBonuses(timestamp);

    //Move bonuses only if there is bonuses on the screen (because they will be rare).
    if (state.hasBonuses) {
      if (document.getElementsByClassName('bonus').length > 0) {
        this.gameService.moveAllBonuses();
      } else {
        state.hasBonuses = false;
      }
    }

    if (!state.gameOver) {
      state.points++;

      if (state.points % 10 == 0) {
        this.points = state.points;

        if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
          this.level = ++state.level;
          this.modifyGameDifficulty();
          notifySuccess(`Congratulation! Level ${state.level} reached!`);
          await this.gameService.sleep(2500);
        }
      }

      //Pause game
      if (!state.isPaused) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      } else {
        document.addEventListener('keypress', this.onResume.bind(this));
      }
    } else {
      console.log('game over!', state.points);
    }
  }

  onResume(e: any) {
    if (state.isPaused && e.code == 'KeyR') {
      state.isPaused = false;
      window.requestAnimationFrame(this.gameLoop.bind(this));
      //TODO: This doesn't remove the event listener!?!
      document.removeEventListener('keypress', this.onResume);
    }
  }

  modifyGameDifficulty(): void {
    alien.speed++;
    alien.creationInterval -= 600;
  }

  createBonuses(timestamp: number): void {
    //Create an double-fire-bonus
    //TODO: Check for solution. Timestamp increses even if game is not started yet. If button start game isn't clicked soon after component init th bonuses will be created immediately after game started! 
    if (doubleFireBonus.nextCreation < timestamp) {
      this.gameService.createDoubleFireBonus();

      state.hasBonuses = true;
      doubleFireBonus.nextCreation = timestamp + (doubleFireBonus.creationInterval * Math.random()) + 10000;
    }

    //Create an aim-bonus
    if (aimBonus.nextCreation < timestamp) {
      this.gameService.createAimBonus();

      state.hasBonuses = true;
      aimBonus.nextCreation = timestamp + (aimBonus.creationInterval * Math.random()) + 20000;
    }

    //Create an invisible-bonus
    if (invisibleBonus.nextCreation < timestamp) {
      this.gameService.createInsivibleBonus();

      state.hasBonuses = true;
      invisibleBonus.nextCreation = timestamp + (invisibleBonus.creationInterval * Math.random()) + 30000;
    }
  }
}
