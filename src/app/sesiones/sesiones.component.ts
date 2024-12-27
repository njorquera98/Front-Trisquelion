import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SesionService } from '../services/sesion.service';
import { Sesion } from '../models/sesion.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sesiones',
  imports: [CommonModule],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.css'
})

export class SesionesComponent implements OnInit {
  @Input() pacienteId!: number;
  sesiones: Sesion[] = [];

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
}

