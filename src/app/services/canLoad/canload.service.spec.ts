import { TestBed } from '@angular/core/testing';

import { CanloadService } from './canload.service';

describe('CanloadService', () => {
  let service: CanloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
