import { TestBed } from '@angular/core/testing';

import { BossService } from './boss.service';

describe('BossService', () => {
  let service: BossService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BossService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
