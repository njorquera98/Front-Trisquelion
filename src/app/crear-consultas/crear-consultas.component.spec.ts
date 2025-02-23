import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearConsultasComponent } from './crear-consultas.component';

describe('CrearConsultasComponent', () => {
  let component: CrearConsultasComponent;
  let fixture: ComponentFixture<CrearConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
