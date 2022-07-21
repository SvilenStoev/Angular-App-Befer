import { TestBed } from '@angular/core/testing';

import { WeaponBossService } from './weapon-boss.service';

describe('WeaponBossService', () => {
  let service: WeaponBossService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponBossService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
