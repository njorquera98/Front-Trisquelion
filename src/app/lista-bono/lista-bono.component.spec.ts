import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBonoComponent } from './lista-bono.component';

describe('ListaBonoComponent', () => {
  let component: ListaBonoComponent;
  let fixture: ComponentFixture<ListaBonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaBonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaBonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
