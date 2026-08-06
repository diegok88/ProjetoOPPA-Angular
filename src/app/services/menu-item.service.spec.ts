import { TestBed } from '@angular/core/testing';

import { MenuItem } from './menu-item';

describe('MenuItem', () => {
  let service: MenuItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
