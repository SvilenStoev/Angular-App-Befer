import { TestBed } from '@angular/core/testing';

import { BossGameService } from './boss-game.service';

describe('BossGameService', () => {
  let service: BossGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BossGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
