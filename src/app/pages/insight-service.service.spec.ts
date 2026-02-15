import { TestBed } from '@angular/core/testing';

import { InsightServiceService } from './insight-service.service';

describe('InsightServiceService', () => {
  let service: InsightServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsightServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
