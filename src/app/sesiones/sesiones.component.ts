import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SesionService } from '../services/sesion.service';
import { Sesion } from '../models/sesion.model';
import { CommonModule } from '@angular/common';
import { CrearSesionComponent } from '../crear-sesion/crear-sesion.component';

@Component({
  selector: 'app-sesiones',
  imports: [CommonModule, CrearSesionComponent],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.css'
})

export class SesionesComponent implements OnInit {
  @Input() pacienteId!: number;
  sesiones: Sesion[] = [];
  mostrarModal = false;

  constructor(
    private route: ActivatedRoute,
    private sesionService: SesionService,
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.cargarSesiones(this.pacienteId);
    }
  }

  cargarSesiones(pacienteId: number): void {
    this.sesionService.obtenerSesionesPorPaciente(pacienteId).subscribe(
      (sesiones) => {
        // Invertir el array de sesiones
        this.sesiones = sesiones.reverse();
      },
      (error) => {
        console.error('Error al cargar las sesiones:', error);
      }
    );
  }
  // Método para abrir el modal
  abrirModal() {
    this.mostrarModal = true;
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  // Método para manejar el cierre del modal cuando la sesión se guarda
  manejarSesionCreada() {
    this.cerrarModal(); // Cerrar el modal
    this.cargarSesiones(this.pacienteId); // Recargar las sesiones si es necesario
  }
}

