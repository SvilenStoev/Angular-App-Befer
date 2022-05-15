import { TestBed } from '@angular/core/testing';

import { TabTitleService } from './tab-title.service';

describe('TabTitleService', () => {
  let service: TabTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
