import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalAdmin } from './principal-admin';

describe('PrincipalAdmin', () => {
  let component: PrincipalAdmin;
  let fixture: ComponentFixture<PrincipalAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
