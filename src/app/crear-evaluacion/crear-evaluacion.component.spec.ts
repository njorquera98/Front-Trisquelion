import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEvaluacionComponent } from './crear-evaluacion.component';

describe('CrearEvaluacionComponent', () => {
  let component: CrearEvaluacionComponent;
  let fixture: ComponentFixture<CrearEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
