import { TestBed } from '@angular/core/testing';

import { DashboardEndpointService } from './dashboard-endpoint.service';

describe('DashboardEndpointService', () => {
  let service: DashboardEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
