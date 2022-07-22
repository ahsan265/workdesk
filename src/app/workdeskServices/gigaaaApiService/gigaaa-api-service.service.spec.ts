import { TestBed } from '@angular/core/testing';

import { GigaaaApiService } from './gigaaa-api-service.service';

describe('GigaaaApiServiceService', () => {
  let service: GigaaaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GigaaaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
