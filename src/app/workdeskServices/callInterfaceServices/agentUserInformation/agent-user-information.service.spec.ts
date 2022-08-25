import { TestBed } from '@angular/core/testing';
import { AgentUserInformation } from './agent-user-information.service';

describe('AgentUserInformation', () => {
  let service: AgentUserInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentUserInformation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
