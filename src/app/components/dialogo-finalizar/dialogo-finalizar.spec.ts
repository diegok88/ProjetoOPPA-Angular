import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFinalizar } from './dialogo-finalizar';

describe('DialogoFinalizar', () => {
  let component: DialogoFinalizar;
  let fixture: ComponentFixture<DialogoFinalizar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoFinalizar],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoFinalizar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
