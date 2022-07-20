import { TestBed } from '@angular/core/testing';

import { GigaaaApiServiceService } from './gigaaa-api-service.service';

describe('GigaaaApiServiceService', () => {
  let service: GigaaaApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GigaaaApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
