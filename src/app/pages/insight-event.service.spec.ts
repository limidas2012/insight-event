import { TestBed } from '@angular/core/testing';

import { InsightEventService } from './insight-event.service';

describe('InsightEventService', () => {
  let service: InsightEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsightEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
