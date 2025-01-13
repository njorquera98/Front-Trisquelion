import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesPasadasComponent } from './evaluaciones-pasadas.component';

describe('EvaluacionesPasadasComponent', () => {
  let component: EvaluacionesPasadasComponent;
  let fixture: ComponentFixture<EvaluacionesPasadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionesPasadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionesPasadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
