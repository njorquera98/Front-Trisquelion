import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNotaComponent } from './crear-nota.component';

describe('CrearNotaComponent', () => {
  let component: CrearNotaComponent;
  let fixture: ComponentFixture<CrearNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
