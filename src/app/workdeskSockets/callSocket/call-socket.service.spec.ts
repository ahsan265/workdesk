import { TestBed } from '@angular/core/testing';

import { CallSocketService } from './call-socket.service';

describe('CallSocketService', () => {
  let service: CallSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
