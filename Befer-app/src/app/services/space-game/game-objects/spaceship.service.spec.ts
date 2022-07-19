import { TestBed } from '@angular/core/testing';

import { SpaceshipService } from './spaceship.service';

describe('SpaceshipService', () => {
  let service: SpaceshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
