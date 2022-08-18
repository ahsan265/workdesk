import { TestBed } from '@angular/core/testing';

import { DialCallService } from './dial-call.service';

describe('DialCallService', () => {
  let service: DialCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
