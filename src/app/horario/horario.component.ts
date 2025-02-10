import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../services/horario.service';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { Horario } from '../models/horario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-horario',
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})

export class HorarioComponent implements OnInit {
  toggleActivo: boolean = true;
  pacienteId!: number;

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horarios: string[] = [];

  asistencia: { [dia: string]: string | null } = {}; // Un solo horario por día
  horariosExistentes: { [dia: string]: Horario } = {}; // Almacena los horarios en la BD

  constructor(
    private horarioService: HorarioService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      this.obtenerHorariosPaciente();
    });

    // Inicializar asistencia en null
    this.dias.forEach(dia => (this.asistencia[dia] = null));

    for (let i = 9; i <= 20; i++) {
      // Agregar la hora completa (por ejemplo, 09:00:00)
      this.horarios.push(`${i.toString().padStart(2, '0')}:00:00`);
      // Agregar la media hora (por ejemplo, 09:30:00), solo hasta las 20:00
      if (i < 20) {
        this.horarios.push(`${i.toString().padStart(2, '0')}:30:00`);
      }
    }
  }

  obtenerHorariosPaciente(): void {
    this.horarioService.obtenerHorarios(this.pacienteId).subscribe(
      (horarios: Horario[]) => {
        console.log('Horarios obtenidos:', horarios);
        this.horariosExistentes = {}; // Reiniciamos la estructura

        this.dias.forEach(dia => {
          const horario = horarios.find(h => h.dia_semana === dia);
          if (horario) {
            // Si la hora es "00:00:00", lo tratamos como "No asiste"
            this.asistencia[dia] = horario.hora === '00:00:00' ? null : horario.hora;
            this.horariosExistentes[dia] = horario; // Guardamos horario existente
          } else {
            this.asistencia[dia] = null; // Si no se encontró horario, marcar como no asiste
          }
        });

        console.log('Asistencia:', this.asistencia);
      },
      error => console.error('Error obteniendo horarios:', error)
    );
  }

  onHorarioChange(dia: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    // Limpiar el valor para eliminar cualquier espacio extra
    const selectedHora = selectElement.value === 'null' ? null : selectElement.value.trim();
    this.asistencia[dia] = selectedHora;  // Asignar el valor limpio
  }


  onToggleChange(): void {
    this.pacienteService.updatePacienteEstado(this.pacienteId, this.toggleActivo).subscribe(
      response => console.log('Paciente actualizado:', response),
      error => console.error('Error actualizando paciente:', error)
    );
  }

  guardarHorarios(): void {
    Object.entries(this.asistencia).forEach(([dia, hora]) => {
      if (hora && hora.includes(":")) {  // Asegurarse de que sea una hora válida
        const cleanedHora = hora.trim();  // Limpiar la hora para eliminar espacios
        const horarioExistente = this.horariosExistentes[dia];

        if (horarioExistente) {
          // Si el horario ya existe, solo lo actualizamos si la hora ha cambiado
          if (horarioExistente.hora !== cleanedHora) {
            this.horarioService.actualizarHorario(horarioExistente.horario_id!, { hora: cleanedHora }).subscribe(
              response => {
                console.log(`Horario actualizado para ${dia}:`, response);
                // Actualizamos en el objeto de horariosExistentes para reflejar el cambio
                this.horariosExistentes[dia].hora = cleanedHora;
              },
              error => console.error(`Error al actualizar ${dia}:`, error)
            );
          }
        } else {
          // Si el horario no existe y no es null, lo creamos
          if (cleanedHora !== null) {
            const nuevoHorario: Horario = {
              paciente_fk: this.pacienteId,
              dia_semana: dia,
              hora: cleanedHora
            };
            this.horarioService.agregarHorario(nuevoHorario).subscribe(
              response => {
                console.log(`Horario creado para ${dia}:`, response);
                // Guardamos el nuevo horario en horariosExistentes
                this.horariosExistentes[dia] = response;
              },
              error => console.error(`Error creando ${dia}:`, error)
            );
          }
        }
      } else {
        console.log(`Horario no válido para ${dia}:`, hora);  // Verificar hora antes de guardar
      }
    });
  }

  guardarAsistencia(): void {
    this.guardarHorarios();
    console.log('Asistencia guardada');
  }
}

