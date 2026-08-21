import { TestBed } from '@angular/core/testing';

import { DialogFinalizarService } from './dialog-finalizar.service';

describe('DialogFinalizarService', () => {
  let service: DialogFinalizarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogFinalizarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
