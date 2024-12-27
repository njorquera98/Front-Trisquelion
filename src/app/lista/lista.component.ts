import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../models/paciente.model';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  pacientes: Paciente[] = [];
  toggleActivo: boolean = true;  // Controla el estado del toggle

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPacientes();  // Cargar los pacientes al inicio
  }

  // Método para cargar los pacientes según el estado del toggle
  cargarPacientes() {
    console.log('Estado del toggleActivo:', this.toggleActivo);  // Verificar si el valor cambia
    if (this.toggleActivo) {
      this.pacienteService.getPacientesActivos().subscribe({
        next: (data) => {
          this.pacientes = data;
        },
        error: (err) => {
          console.error('Error al obtener pacientes activos:', err);
        }
      });
    } else {
      this.pacienteService.getPacientesInactivos().subscribe({
        next: (data) => {
          this.pacientes = data;
        },
        error: (err) => {
          console.error('Error al obtener pacientes inactivos:', err);
        }
      });
    }
  }

  // Método que se ejecuta cuando se cambia el toggle
  onToggleChange() {
    console.log('Toggle cambiado:', this.toggleActivo);  // Verificar si cambia correctamente
    this.cargarPacientes();  // Recargar pacientes según el toggle
  }

  // Método para redirigir a la página de sesiones de un paciente
  redirigirAPaciente(pacienteId: number): void {
    this.router.navigate([`/paciente/${pacienteId}`]); // Redirige a /sesiones/{id}
  }
}

