import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPesoComponent } from './crear-peso.component';

describe('CrearPesoComponent', () => {
  let component: CrearPesoComponent;
  let fixture: ComponentFixture<CrearPesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPesoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
