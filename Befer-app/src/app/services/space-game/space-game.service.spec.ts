import { TestBed } from '@angular/core/testing';

import { SpaceGameService } from './space-game.service';

describe('SpaceGameService', () => {
  let service: SpaceGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
