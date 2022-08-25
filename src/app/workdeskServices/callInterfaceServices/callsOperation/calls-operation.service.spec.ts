import { TestBed } from '@angular/core/testing';

import { CallsOperationService } from './calls-operation.service';

describe('CallsOperationService', () => {
  let service: CallsOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallsOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
