import { TestBed } from '@angular/core/testing';

import { getOrganizationService } from './organization-service.service';

describe('OrganizationServiceService', () => {
  let service: getOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(getOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
