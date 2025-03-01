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
  pacientesFiltrados: Paciente[] = []; // Lista para mostrar los pacientes filtrados
  toggleActivo: boolean = true;
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  searchTerm: string = ''; // Almacena el término de búsqueda

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
        this.filtrarPacientes(); // Filtrar pacientes cuando los datos se cargan
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      },
    });
  }

  // Método que se ejecuta cuando se cambia el toggle
  onToggleChange(): void {
    this.cargarPacientes();  // Recargar pacientes según el toggle
  }

  // Método para filtrar pacientes según el término de búsqueda
  filtrarPacientes(): void {
    if (this.searchTerm) {
      this.pacientesFiltrados = this.pacientes.filter(paciente =>
        paciente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paciente.telefono.includes(this.searchTerm)
      );
    } else {
      this.pacientesFiltrados = [...this.pacientes]; // Si no hay búsqueda, mostrar todos
    }
  }

  // Método que se ejecuta cuando el usuario ingresa texto en el input
  onSearch(): void {
    this.filtrarPacientes();
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

    // Filtrar nuevamente después de agregar el nuevo paciente
    this.filtrarPacientes();

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

