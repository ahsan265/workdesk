import { TestBed } from '@angular/core/testing';

import { PeerConnectionService } from './peer-connection.service';

describe('PeerConnectionService', () => {
  let service: PeerConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeerConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
