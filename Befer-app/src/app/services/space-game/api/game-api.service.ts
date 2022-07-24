import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { createPointer } from 'src/app/auth/util';

import { ApiService } from '../../api.service';
import { UserService } from '../../auth/user.service';

export interface UserScoresDto {
  aliensKilled: number,
  timeRemaining: number,
  boostRemaining: number,
  points: number,
  totalPoints: number,
  player: CreatePlayerDto,
}

export interface CreatePlayerDto {
  __type: string,
  className: string,
  objectId: string,
}

@Injectable()
export class GameApiService {

  postColl: string = '/classes/GameScores';

  constructor(private api: ApiService, private userService: UserService) { }

  createScores$(userScores: UserScoresDto): Observable<any> {
    const userId = this.userService.userId;

    if (!userId) {
      throw new Error('Something went wrong!');
    }

    userScores.player = createPointer('_User', userId);

    return this.api
      .post<any>(this.postColl, userScores)
      .pipe(
        map(response => response.body));
  }

  loadMyScores$(limit: number): Observable<any> {
    const userId = this.userService.userId;

    const pointerQuery = JSON.stringify({
      "player": createPointer('_User', userId)
    });

    return this.api.get(`${this.postColl}/?where=${pointerQuery}${limit ? `&limit=${limit}` : ''}&include=player`);
  }

  loadAllScores$(limit: number = 10): Observable<any> {
    return this.api.get(`${this.postColl}?include=player&limit=${limit}`);
  }

  updateScores$(userScores: UserScoresDto, id: string): Observable<any> {
    return this.api
      .put<any>(`${this.postColl}/${id}`, userScores)
      .pipe(
        map(response => response.body));
  }
}
