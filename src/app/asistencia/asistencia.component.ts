import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asistencia',
  imports: [FormsModule, CommonModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent {
  toggleActivo: boolean = true;

  // Configuración inicial
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horarios: string[] = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

  // Estado de asistencia: Almacena días y horarios seleccionados
  asistencia: { [dia: string]: string[] } = {};

  constructor() {
    // Inicializar el estado de asistencia con arrays vacíos
    this.dias.forEach(dia => {
      this.asistencia[dia] = [];
    });
  }
  onToggleChange(): void {
    console.log('Toggle cambiado:', this.toggleActivo);
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

