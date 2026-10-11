import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrocarPin } from './trocar-pin';

describe('TrocarPin', () => {
  let component: TrocarPin;
  let fixture: ComponentFixture<TrocarPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrocarPin],
    }).compileComponents();

    fixture = TestBed.createComponent(TrocarPin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
