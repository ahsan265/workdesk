import { TestBed } from '@angular/core/testing';

import { QueueSocketService } from './queue-socket.service';

describe('QueueSocketService', () => {
  let service: QueueSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueueSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
