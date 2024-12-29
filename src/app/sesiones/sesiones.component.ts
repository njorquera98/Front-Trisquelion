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
  sesiones: any[] = [];
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
    this.sesionService.getSesionesConFolio(pacienteId).subscribe(
      (sesiones) => {
        this.sesiones = sesiones.reverse(); // Opcional: invertir el array para mostrar las últimas sesiones primero
      },
      (error) => {
        console.error('Error al cargar las sesiones:', error);
      }
    );
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  manejarSesionCreada() {
    this.cerrarModal();
    this.cargarSesiones(this.pacienteId);
  }
}

