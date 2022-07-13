import { Component, OnInit } from '@angular/core';
import { SpaceGameService } from 'src/app/services/components/space-game.service';

@Component({
  selector: 'app-space-fight-game',
  templateUrl: './space-fight-game.component.html',
  styleUrls: ['./space-fight-game.component.css']
})
export class SpaceFightGameComponent implements OnInit {

  isGameStarted: boolean = false;
  spaceship: any = {};
  playScreen: any = {};

  constructor(private gameService: SpaceGameService) { }

  ngOnInit(): void {
    this.playScreen = document.querySelector('.play-screen');
  }

  startGame() {
    this.isGameStarted = true;
    this.spaceship = this.gameService.createSpaceship(200, 100);
    this.playScreen.appendChild(this.spaceship);
  }
}
