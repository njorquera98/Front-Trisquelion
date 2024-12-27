import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasMedicasComponent } from './consultas-medicas.component';

describe('ConsultasMedicasComponent', () => {
  let component: ConsultasMedicasComponent;
  let fixture: ComponentFixture<ConsultasMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasMedicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
