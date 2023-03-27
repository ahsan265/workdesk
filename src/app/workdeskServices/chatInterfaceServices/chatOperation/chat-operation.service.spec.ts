import { TestBed } from '@angular/core/testing';
import { ChatOperationService } from './chat-operation.service';
describe('ChatOperationServiceService', () => {
  let service: ChatOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
