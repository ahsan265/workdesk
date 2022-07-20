import { TestBed } from '@angular/core/testing';

import { SharedResourceServiceService } from './shared-resource-service.service';

describe('SharedResourceServiceService', () => {
  let service: SharedResourceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedResourceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
