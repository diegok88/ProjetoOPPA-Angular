import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Falhas } from './falhas';

describe('Falhas', () => {
  let component: Falhas;
  let fixture: ComponentFixture<Falhas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Falhas],
    }).compileComponents();

    fixture = TestBed.createComponent(Falhas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
