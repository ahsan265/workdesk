import { TestBed } from '@angular/core/testing';

import { AgentSocketService } from './agent-socket.service';

describe('AgentSocketService', () => {
  let service: AgentSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
