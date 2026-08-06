import { TestBed } from '@angular/core/testing';

import { RoleGuardServiceTs } from './role-guard.service.js';

describe('RoleGuardServiceTs', () => {
  let service: RoleGuardServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleGuardServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
