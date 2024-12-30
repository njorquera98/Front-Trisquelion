import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBonoComponent } from './crear-bono.component';

describe('CrearBonoComponent', () => {
  let component: CrearBonoComponent;
  let fixture: ComponentFixture<CrearBonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearBonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearBonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
