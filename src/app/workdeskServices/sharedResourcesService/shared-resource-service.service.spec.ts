import { TestBed } from '@angular/core/testing';

import { SharedServices } from './shared-resource-service.service';

describe('SharedResourceServiceService', () => {
  let service: SharedServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
