import { TestBed } from '@angular/core/testing';

import { AgentInviteService } from './agent-invite.service';

describe('AgentinviteService', () => {
  let service: AgentInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentInviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
