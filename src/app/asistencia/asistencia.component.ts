import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarAsistenciaComponent } from '../confirmar-asistencia/confirmar-asistencia.component';
import { AsistenciaService } from '../services/asistencia.service';
import { Asistencia } from '../models/asistencia.model';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmarAsistenciaComponent],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  modalVisible = false;
  pacienteSeleccionado: any = null;

  diaHoy: string = '';
  fechaSeleccionada: string = '';
  diasRango: string[] = [];
  horariosPorDia: { [fecha: string]: Asistencia[] } = {};

  constructor(private asistenciaService: AsistenciaService) { }

  // Incluir Domingo para que coincida con getDay() de JavaScript (0 = Domingo)
  diasSemanaCompleta: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Esta sigue siendo útil si quieres mostrar solo de lunes a sábado
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  obtenerFechaDelDiaSemana(dia: string): string {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
    const indexDeseado = this.diasSemanaCompleta.indexOf(dia); // Buscar índice en el array completo
    const diferenciaDias = (indexDeseado - diaActual + 7) % 7;

    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + diferenciaDias);

    return fecha.toLocaleDateString('es-ES');
  }

  ngOnInit(): void {
    this.obtenerFechaHoy();
    const fechaInicio = this.getInicioSemana();
    this.generarRangoDias(fechaInicio);
    this.cargarAsistenciasDeDosSemanas();
  }

  obtenerFechaHoy(): void {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    this.diaHoy = hoy.toLocaleDateString('es-ES', opciones);

    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const año = hoy.getFullYear();

    this.fechaSeleccionada = `${dia}-${mes}-${año}`;
  }

  getInicioSemana(): string {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // Domingo = 0
    const offset = diaSemana === 0 ? -6 : 1 - diaSemana;
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() + offset);

    const yyyy = inicioSemana.getFullYear();
    const mm = String(inicioSemana.getMonth() + 1).padStart(2, '0');
    const dd = String(inicioSemana.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  generarRangoDias(fechaInicio: string) {
    this.diasRango = [];
    const inicio = new Date(fechaInicio);

    for (let i = 0; i < 14; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);

      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');

      this.diasRango.push(`${yyyy}-${mm}-${dd}`);
    }

    console.log('Fechas generadas para los 14 días:', this.diasRango); // 👈 LOG 3
  }

  cargarAsistenciasDeDosSemanas(): void {
    if (this.diasRango.length === 0) return;

    this.asistenciaService.getAsistenciasPorRango(this.diasRango[0], this.diasRango[this.diasRango.length - 1])
      .subscribe((asistencias: Asistencia[]) => {
        console.log('Asistencias recibidas del backend:', asistencias); // 👈 LOG 1
        this.horariosPorDia = {};

        asistencias.forEach((a: Asistencia) => {
          const fecha = a.fecha;
          if (!this.horariosPorDia[fecha]) {
            this.horariosPorDia[fecha] = [];
          }
          this.horariosPorDia[fecha].push(a);
        });
        console.log('Horarios organizados por día:', this.horariosPorDia); // 👈 LOG 2
      });
  }

  abrirModal(horario: Asistencia, fecha: string): void {
    this.pacienteSeleccionado = {
      nombreCompleto: horario.paciente?.nombre + ' ' + horario.paciente?.apellido,
      hora: horario.hora_programada,
      fecha: fecha,
      pacienteId: horario.paciente?.paciente_id,
      dia: fecha,
      horarioOriginal: horario
    };
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
  }

  procesarRespuesta(resultado: 'si' | 'no' | 'suspende' | 'reprogramar') {
    if (!this.pacienteSeleccionado) return;

    const estadoMap = {
      si: 'Si Asiste',
      no: 'No Asiste',
      suspende: 'Suspendido',
      reprogramar: 'Reprogramado',
    };

    const nuevoEstado = estadoMap[resultado];

    this.asistenciaService.actualizarEstadoAsistencia(
      this.pacienteSeleccionado.pacienteId,
      this.pacienteSeleccionado.fecha,
      this.pacienteSeleccionado.hora,
      nuevoEstado
    ).subscribe({
      next: () => {
        this.actualizarEstadoHorario(
          this.horariosPorDia[this.pacienteSeleccionado.fecha],
          this.pacienteSeleccionado.horarioOriginal,
          this.pacienteSeleccionado.nombreCompleto,
          nuevoEstado
        );
        this.cerrarModal();
      },
      error: () => {
        alert('Error al actualizar la asistencia. Intente nuevamente.');
      }
    });
  }

  actualizarEstadoHorario(
    horarios: Asistencia[],
    horarioSeleccionado: Asistencia,
    nombreBuscar: string,
    estado: string
  ): void {
    const index = horarios.findIndex(h =>
      h.hora_programada === horarioSeleccionado.hora_programada &&
      (h.paciente?.nombre + ' ' + h.paciente?.apellido).trim().toLowerCase() === nombreBuscar.toLowerCase()
    );

    if (index !== -1) {
      horarios[index].estado = estado;
      this.horariosPorDia = { ...this.horariosPorDia };
    }
  }

  procesarReprogramacion(data: { fecha: string; hora: string }) {
    if (!this.pacienteSeleccionado) return;

    this.asistenciaService.actualizarEstadoAsistencia(
      this.pacienteSeleccionado.pacienteId,
      data.fecha,
      data.hora,
      'Reprogramado'
    ).subscribe({
      next: () => {
        this.actualizarEstadoHorario(
          this.horariosPorDia[this.pacienteSeleccionado.fecha],
          this.pacienteSeleccionado.horarioOriginal,
          this.pacienteSeleccionado.nombreCompleto,
          'Reprogramado'
        );
        this.cerrarModal();
      },
      error: () => {
        alert('Error al reprogramar la asistencia. Intente nuevamente.');
      }
    });
  }
}

