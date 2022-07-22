import { TestBed } from '@angular/core/testing';

import { ConnectionSecurityService } from './connection-security.service';

describe('ConnectionSecurityService', () => {
  let service: ConnectionSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
