import { TestBed } from '@angular/core/testing';

import { DevicesInformationService } from './devices-information.service';

describe('DevicesInformationService', () => {
  let service: DevicesInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicesInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
