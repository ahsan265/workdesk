import { TestBed } from '@angular/core/testing';

import { AnalyticsSocketService } from './analytics-socket.service';

describe('AnalyticsSocketService', () => {
  let service: AnalyticsSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
