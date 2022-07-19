import { TestBed } from '@angular/core/testing';

import { AlienService } from './alien.service';

describe('AlienService', () => {
  let service: AlienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
