import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciaSetorial } from './competencia-setorial';

describe('CompetenciaSetorial', () => {
  let component: CompetenciaSetorial;
  let fixture: ComponentFixture<CompetenciaSetorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenciaSetorial],
    }).compileComponents();

    fixture = TestBed.createComponent(CompetenciaSetorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
