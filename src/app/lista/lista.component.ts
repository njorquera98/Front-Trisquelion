import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../models/paciente.model';
import { CrearPacienteComponent } from '../crear-paciente/crear-paciente.component';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, FormsModule, CrearPacienteComponent],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  pacientes: Paciente[] = [];
  toggleActivo: boolean = true;
  mostrarModal: boolean = false;  // Controla la visibilidad del modal

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPacientes();  // Cargar pacientes al iniciar
  }

  // Método para cargar pacientes según el estado del toggle
  cargarPacientes(): void {
    const serviceMethod = this.toggleActivo
      ? this.pacienteService.getPacientesActivos()
      : this.pacienteService.getPacientesInactivos();

    serviceMethod.subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      },
    });
  }

  // Método que se ejecuta cuando se cambia el toggle
  onToggleChange(): void {
    console.log('Toggle cambiado:', this.toggleActivo);
    this.cargarPacientes();  // Recargar pacientes según el toggle
  }

  // Método para abrir el modal en modo creación
  abrirModal(): void {
    this.mostrarModal = true;  // Mostrar el modal
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false; // Ocultar el modal
  }

  // Método para manejar el evento de paciente guardado
  onPacienteGuardado(paciente: Paciente): void {
    // Agregar el nuevo paciente al inicio de la lista
    this.pacientes = [paciente, ...this.pacientes];

    // Cerrar el modal
    this.cerrarModal();
  }

  // Método para redirigir a la página de sesiones de un paciente
  redirigirAPaciente(pacienteId: number): void {
    this.router.navigate([`/paciente/${pacienteId}`]);
  }

  // Método para guardar un nuevo paciente
  guardarNuevoPaciente(paciente: Paciente): void {
    this.pacienteService.createPaciente(paciente).subscribe({
      next: (nuevoPaciente) => {
        console.log('Paciente guardado:', nuevoPaciente);
        this.cargarPacientes(); // Recargar la lista de pacientes
        this.cerrarModal();
      },
      error: (err) => console.error('Error al guardar paciente:', err),
    });
  }
}
