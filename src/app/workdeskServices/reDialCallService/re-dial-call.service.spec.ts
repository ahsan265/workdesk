import { TestBed } from '@angular/core/testing';

import { ReDialCallService } from './re-dial-call.service';

describe('ReDialCallService', () => {
  let service: ReDialCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReDialCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
