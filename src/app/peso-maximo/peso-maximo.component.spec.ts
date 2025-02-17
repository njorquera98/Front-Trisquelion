import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesoMaximoComponent } from './peso-maximo.component';

describe('PesoMaximoComponent', () => {
  let component: PesoMaximoComponent;
  let fixture: ComponentFixture<PesoMaximoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesoMaximoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesoMaximoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
