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

  showAlertError: boolean = false;
  showAlertSuccess: boolean = false;

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
    let selectedHora: string | null = selectElement.value.trim();  // Permitimos que sea null también

    // Verificar si la opción seleccionada es "No asiste" y establecer hora a null
    if (selectedHora === 'null') {
      selectedHora = null;  // Establecer null si la opción "No asiste" es seleccionada
    }

    // Asignar el valor seleccionado al objeto de asistencia
    this.asistencia[dia] = selectedHora;
  }


  onToggleChange(): void {
    this.pacienteService.updatePacienteEstado(this.pacienteId, this.toggleActivo).subscribe(
      response => console.log('Paciente actualizado:', response),
      error => console.error('Error actualizando paciente:', error)
    );
  }

  guardarHorarios(): void {
    let horariosGuardadosCorrectamente = true;
    let totalRequests = 0;
    let completedRequests = 0;

    Object.entries(this.asistencia).forEach(([dia, hora]) => {
      console.log(`Procesando horario para ${dia}:`, hora);

      // Si la hora es "00:00:00", la consideramos como null
      if (hora === '0: null') {
        console.log(`Hora es "00:00:00" para ${dia}`);
        hora = null;  // Asignamos null si es necesario
      }

      // Si la hora es null, no la procesamos más, pero la guardamos
      if (hora === null) {
        console.log(`Hora es null para ${dia}`);
        // Aquí guardamos el valor null para el día correspondiente
        const horarioExistente = this.horariosExistentes[dia];
        totalRequests++;

        if (horarioExistente) {
          // Si ya existe, lo actualizamos con null
          this.horarioService.actualizarHorario(horarioExistente.horario_id!, { hora: null }).subscribe(
            response => {
              console.log(`Horario actualizado para ${dia}:`, response);
              this.horariosExistentes[dia].hora = null;
            },
            error => {
              console.error(`Error al actualizar ${dia}:`, error);
              horariosGuardadosCorrectamente = false;
            },
            () => {
              completedRequests++;
              if (completedRequests === totalRequests) {
                console.log('Finalizando la actualización de horarios');
                this.mostrarAlertas(horariosGuardadosCorrectamente);
              }
            }
          );
        } else {
          // Si no existe, lo creamos con null
          const nuevoHorario: Horario = {
            paciente_fk: this.pacienteId,
            dia_semana: dia,
            hora: null
          };
          console.log(`Creando nuevo horario para ${dia}:`, nuevoHorario);
          this.horarioService.agregarHorario(nuevoHorario).subscribe(
            response => {
              console.log(`Horario creado para ${dia}:`, response);
              this.horariosExistentes[dia] = response;
            },
            error => {
              console.error(`Error creando ${dia}:`, error);
              horariosGuardadosCorrectamente = false;
            },
            () => {
              completedRequests++;
              if (completedRequests === totalRequests) {
                console.log('Finalizando la creación de horarios');
                this.mostrarAlertas(horariosGuardadosCorrectamente);
              }
            }
          );
        }
      } else if (hora && hora.includes(":")) {
        // Si la hora es válida, limpiamos y procesamos normalmente
        const cleanedHora = hora.trim();  // Limpiar espacios y asegurarse de que hora no sea null
        console.log(`Hora limpia para ${dia}:`, cleanedHora);

        const horarioExistente = this.horariosExistentes[dia];

        totalRequests++;

        if (horarioExistente) {
          // Si el horario ya existe, lo actualizamos solo si la hora ha cambiado
          if (horarioExistente.hora !== cleanedHora) {
            this.horarioService.actualizarHorario(horarioExistente.horario_id!, { hora: cleanedHora }).subscribe(
              response => {
                console.log(`Horario actualizado para ${dia}:`, response);
                this.horariosExistentes[dia].hora = cleanedHora;
              },
              error => {
                console.error(`Error al actualizar ${dia}:`, error);
                horariosGuardadosCorrectamente = false;
              },
              () => {
                completedRequests++;
                if (completedRequests === totalRequests) {
                  console.log('Finalizando la actualización de horarios');
                  this.mostrarAlertas(horariosGuardadosCorrectamente);
                }
              }
            );
          }
        } else {
          // Si el horario no existe, lo creamos con la hora válida
          const nuevoHorario: Horario = {
            paciente_fk: this.pacienteId,
            dia_semana: dia,
            hora: cleanedHora
          };
          console.log(`Creando nuevo horario para ${dia}:`, nuevoHorario);
          this.horarioService.agregarHorario(nuevoHorario).subscribe(
            response => {
              console.log(`Horario creado para ${dia}:`, response);
              this.horariosExistentes[dia] = response;
            },
            error => {
              console.error(`Error creando ${dia}:`, error);
              horariosGuardadosCorrectamente = false;
            },
            () => {
              completedRequests++;
              if (completedRequests === totalRequests) {
                console.log('Finalizando la creación de horarios');
                this.mostrarAlertas(horariosGuardadosCorrectamente);
              }
            }
          );
        }
      } else {
        console.log(`Horario no válido para ${dia}:`, hora);
        horariosGuardadosCorrectamente = false;
        completedRequests++;
        if (completedRequests === totalRequests) {
          console.log('Finalizando la verificación de horarios inválidos');
          this.mostrarAlertas(horariosGuardadosCorrectamente);
        }
      }
    });
  }


  mostrarAlertas(horariosGuardadosCorrectamente: boolean): void {
    console.log('Mostrar alertas, ¿horarios guardados correctamente?:', horariosGuardadosCorrectamente);
    if (horariosGuardadosCorrectamente) {
      this.showAlertSuccess = true;
      this.showAlertError = false; // Asegurarse de que la alerta de error se oculte si es un éxito
    } else {
      this.showAlertSuccess = false; // Asegurarse de que la alerta de éxito se oculte si hay un error
      this.showAlertError = true;
    }
  }

  guardarAsistencia(): void {
    this.guardarHorarios();
    console.log('Asistencia guardada');
  }
}

