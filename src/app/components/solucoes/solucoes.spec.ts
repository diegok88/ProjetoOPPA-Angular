import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solucoes } from './solucoes';

describe('Solucoes', () => {
  let component: Solucoes;
  let fixture: ComponentFixture<Solucoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solucoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Solucoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
