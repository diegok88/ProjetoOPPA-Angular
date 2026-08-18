import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfimar } from './dialogo-confimar';

describe('DialogoConfimar', () => {
  let component: DialogoConfimar;
  let fixture: ComponentFixture<DialogoConfimar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoConfimar],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoConfimar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
