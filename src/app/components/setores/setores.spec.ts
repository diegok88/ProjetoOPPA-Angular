import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Setores } from './setores';

describe('Setores', () => {
  let component: Setores;
  let fixture: ComponentFixture<Setores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Setores],
    }).compileComponents();

    fixture = TestBed.createComponent(Setores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
