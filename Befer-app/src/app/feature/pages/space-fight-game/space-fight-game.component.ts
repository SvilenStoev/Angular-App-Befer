import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { notifySuccess } from 'src/app/shared/other/notify';
import { state } from 'src/app/shared/space-fight-game/gameState';
import { SpaceGameService } from 'src/app/services/space-game/space-game.service';
import { doubleFireBonus, alien, aimBonus, invisibleBonus } from 'src/app/shared/space-fight-game/gameObjects';
import { SharedService } from 'src/app/services/space-game/shared.service';

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

        if (state.points >= state.levelsRange[(state.level + 1) as keyof typeof state.levelsRange]) {
          this.level = ++state.level;
          this.modifyGameDifficulty();
          notifySuccess(`Congratulation! Level ${state.level} reached!`);
          await this.sharedService.sleep(2500);
        }
      }

      //Pause game
      if (!state.isPaused) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
      } else {
        this.showSettings = true;
        document.addEventListener('keypress', this.onResume.bind(this));
      }
    } else {
      console.log('game over!', state.points);
    }
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
