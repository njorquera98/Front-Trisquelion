import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarAsistenciaComponent } from '../confirmar-asistencia/confirmar-asistencia.component';
import { AsistenciaService } from '../services/asistencia.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Asistencia } from '../models/asistencia.model';

interface HorarioPorDia {
  [fecha: string]: Asistencia[];
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmarAsistenciaComponent],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css',
})
export class AsistenciaComponent implements OnInit {
  diasMostrarFechas: { nombre: string; fecha: Date }[] = [];
  horariosPorDia: HorarioPorDia = {};

  diaHoy: string = '';
  modalVisible = false;
  pacienteSeleccionado: any = null;

  diasPrimeraSemana: { nombre: string; fecha: Date }[] = [];
  diasSegundaSemana: { nombre: string; fecha: Date }[] = [];
  @Input() horarioSeleccionado: any;
  @Output() reprogramar = new EventEmitter<{ fecha: string, hora: string }>();

  constructor(private asistenciaService: AsistenciaService) { }

  ngOnInit() {
    this.generarDiasMostrar();
    this.dividirDiasEnDosFilas();
    this.cargarAsistenciasDosSemanas();
    this.diaHoy = this.obtenerDiaSemanaTexto(new Date());
  }

  formatFechaIso(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  getLunesDeEstaSemana(): Date {
    const hoy = new Date();
    const dia = hoy.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diff);
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  getSabadoDeSemanaSiguiente(): Date {
    const lunes = this.getLunesDeEstaSemana();
    const sabadoSiguiente = new Date(lunes);
    sabadoSiguiente.setDate(lunes.getDate() + 12);
    sabadoSiguiente.setHours(23, 59, 59, 999);
    return sabadoSiguiente;
  }

  formatFecha(date: Date): string {
    return format(date, 'dd/MM/yyyy', { locale: es });
  }

  obtenerDiaSemanaTexto(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    return dias[fecha.getDay()];
  }

  generarDiasMostrar() {
    const lunes = this.getLunesDeEstaSemana();
    this.diasMostrarFechas = [];

    for (let i = 0; i < 14; i++) {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);

      if (fecha.getDay() !== 0) {
        const nombre = this.obtenerDiaSemanaTexto(fecha);
        this.diasMostrarFechas.push({ nombre, fecha });
      }
    }
  }

  dividirDiasEnDosFilas() {
    const mitad = Math.ceil(this.diasMostrarFechas.length / 2);
    this.diasPrimeraSemana = this.diasMostrarFechas.slice(0, mitad);
    this.diasSegundaSemana = this.diasMostrarFechas.slice(mitad);
  }

  cargarAsistenciasDosSemanas() {
    const inicio = this.getLunesDeEstaSemana();
    const fin = this.getSabadoDeSemanaSiguiente();
    const inicioStr = format(inicio, 'yyyy-MM-dd');
    const finStr = format(fin, 'yyyy-MM-dd');

    this.asistenciaService.getAsistenciasRango(inicioStr, finStr).subscribe({
      next: (asistencias) => {
        this.organizarPorDia(asistencias);
      },
      error: (err) => {
        console.error('Error cargando asistencias:', err);
      },
    });
  }

  organizarPorDia(asistencias: Asistencia[]) {
    this.horariosPorDia = {};

    asistencias.forEach((asistencia) => {
      const fecha = parseISO(asistencia.fecha);
      const fechaStr = format(fecha, 'yyyy-MM-dd');

      if (!this.horariosPorDia[fechaStr]) {
        this.horariosPorDia[fechaStr] = [];
      }

      this.horariosPorDia[fechaStr].push(asistencia);
    });
  }

  registrarEstado(asistencia: Asistencia, nuevoEstado: string) {
    this.asistenciaService.updateEstado(asistencia.asistencia_id, nuevoEstado).subscribe({
      next: () => {
        this.cargarAsistenciasDosSemanas();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      },
    });
  }

  abrirModal(horario: any, fecha: string): void {
    this.pacienteSeleccionado = horario.paciente;
    this.horarioSeleccionado = horario;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
    this.horarioSeleccionado = null;
  }

  // Maneja el evento emitido por el modal para actualizar estado (asistió, no asistió, etc)
  procesarRespuesta(estado: string) {
    if (!this.horarioSeleccionado) return;

    this.registrarEstado(this.horarioSeleccionado, estado);

    // Cierra el modal y limpia selección
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
    this.horarioSeleccionado = null;
  }

  // Maneja la reprogramación enviada por el modal con fecha y hora nuevas
  procesarReprogramacion(datos: { fecha: string; hora: string }) {
    if (!this.horarioSeleccionado) return;

    console.log('Horario seleccionado completo:', this.horarioSeleccionado);

    const asistenciaId = this.horarioSeleccionado.asistencia_id;
    const pacienteId = this.horarioSeleccionado.paciente?.paciente_id;

    console.log('Asistencia original ID:', asistenciaId);
    console.log('Paciente ID:', pacienteId);

    if (!pacienteId) {
      console.error('No se encontró el ID del paciente para crear nueva asistencia.');
      return;
    }

    this.asistenciaService.updateEstado(asistenciaId, 'reprogramada').subscribe({
      next: () => {
        const nuevaAsistenciaDto = {
          paciente_fk: pacienteId,
          fecha: datos.fecha,
          hora_programada: datos.hora,
          estado: 'pendiente'
        };

        console.log('Creando nueva asistencia con DTO:', nuevaAsistenciaDto);

        this.asistenciaService.create(nuevaAsistenciaDto).subscribe({
          next: () => {
            console.log('Nueva asistencia creada correctamente');
            this.modalVisible = false;
            this.pacienteSeleccionado = null;
            this.horarioSeleccionado = null;

            // Aquí actualizas la lista de asistencias para reflejar cambios
            this.cargarAsistenciasDosSemanas();
          },
          error: (err) => {
            console.error('Error al crear nueva asistencia:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al actualizar estado de asistencia:', err);
      }
    });
  }
}
