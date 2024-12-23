import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes-activos',
  imports: [CommonModule],
  templateUrl: './pacientes-activos.component.html',
  styleUrl: './pacientes-activos.component.css'
})
export class PacientesActivosComponent {
  pacientes: any[] = []; // Para almacenar los pacientes

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data; // Guarda los datos obtenidos en la variable pacientes
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      }
    });
  }

  // Método para redirigir a la página de sesiones de un paciente
  redirigirASesiones(pacienteId: number): void {
    this.router.navigate([`/sesiones/${pacienteId}`]); // Redirige a /sesiones/{id}
  }
}
