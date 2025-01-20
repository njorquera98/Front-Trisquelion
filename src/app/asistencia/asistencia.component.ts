import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';
import { PacienteComponent } from '../paciente/paciente.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  toggleActivo: boolean = true;
  pacienteId!: number;

  // Configuración inicial
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horarios: string[] = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

  // Estado de asistencia: Almacena días y horarios seleccionados
  asistencia: { [dia: string]: string[] } = {};

  constructor(
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private pacienteComponent: PacienteComponent // Inyectamos el componente PacienteComponent
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id']; // Obtener el pacienteId de la URL
      console.log('Paciente ID:', this.pacienteId);
    });

    // Inicializar el estado de asistencia con arrays vacíos
    this.dias.forEach(dia => {
      this.asistencia[dia] = [];
    });
  }

  onToggleChange(): void {
    console.log('Toggle cambiado:', this.toggleActivo);
    this.actualizarEstadoPaciente(this.toggleActivo);
  }

  // Llamada al servicio para actualizar el estado del paciente
  actualizarEstadoPaciente(estado: boolean): void {
    this.pacienteService.updatePacienteEstado(this.pacienteId, estado).subscribe(
      (response) => {
        console.log('Estado del paciente actualizado:', response);
        // Después de actualizar el estado, recargamos la información del paciente
        this.pacienteComponent.cargarPaciente(this.pacienteId); // Llamamos al método cargarPaciente del componente PacienteComponent
      },
      (error) => {
        console.error('Error al actualizar el estado del paciente:', error);
      }
    );
  }

  // Manejar selección múltiple de horarios
  toggleHorario(dia: string, horario: string): void {
    const index = this.asistencia[dia].indexOf(horario);
    if (index === -1) {
      this.asistencia[dia].push(horario);
    } else {
      this.asistencia[dia].splice(index, 1);
    }
    console.log(`Asistencia actualizada para ${dia}:`, this.asistencia[dia]);
  }

  // Guardar la asistencia
  guardarAsistencia(): void {
    console.log('Asistencia final guardada:', this.asistencia);
  }

  // Manejar cambio de horario en el combobox
  onHorarioChange(dia: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const horario = selectElement.value;

    // Actualizar el horario seleccionado
    this.asistencia[dia] = horario ? [horario] : [];
    console.log(`Horario seleccionado para ${dia}:`, this.asistencia[dia]);
  }
}

