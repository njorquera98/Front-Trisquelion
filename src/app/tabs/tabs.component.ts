import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  @Input() pacienteId: number = 0;  // Asignar un valor inicial, pero asegúrate de cambiarlo más tarde
  @Output() onTabSeleccionada = new EventEmitter<string>();
  constructor(private router: Router) { }

  // Método para redirigir a las pestañas con la ruta adecuada
  redirigir(ruta: string): void {
    this.router.navigate([`/${ruta}/${this.pacienteId}`]);
  }

  seleccionarTab(tab: string): void {
    this.onTabSeleccionada.emit(tab);
  }
}
