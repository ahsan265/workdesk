import { TestBed } from '@angular/core/testing';

import { CallInterfaceService } from './call-interface.service';

describe('CallInterfaceService', () => {
  let service: CallInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
