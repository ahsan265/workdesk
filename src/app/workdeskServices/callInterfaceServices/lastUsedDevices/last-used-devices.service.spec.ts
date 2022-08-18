import { TestBed } from '@angular/core/testing';

import { LastUsedDevicesService } from './last-used-devices.service';

describe('LastUsedDevicesService', () => {
  let service: LastUsedDevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastUsedDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
