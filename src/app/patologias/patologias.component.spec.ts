import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatologiasComponent } from './patologias.component';

describe('PatologiasComponent', () => {
  let component: PatologiasComponent;
  let fixture: ComponentFixture<PatologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatologiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
