import { TestBed } from '@angular/core/testing';

import { DialogConfirmarService } from './dialog-confirmar.service';

describe('DialogConfirmarService', () => {
  let service: DialogConfirmarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogConfirmarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
