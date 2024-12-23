import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesActivosComponent } from './pacientes-activos.component';

describe('PacientesActivosComponent', () => {
  let component: PacientesActivosComponent;
  let fixture: ComponentFixture<PacientesActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesActivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
