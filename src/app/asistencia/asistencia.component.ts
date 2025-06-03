import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario.model';
import { ConfirmarAsistenciaComponent } from '../confirmar-asistencia/confirmar-asistencia.component';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmarAsistenciaComponent],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  horasDelDia: string[] = [
    '09:00:00', '09:30:00', '10:00:00', '11:00:00',
    '14:00:00', '14:30:00', '15:00:00',
    '17:00:00', '18:00:00', '19:30:00'
  ];
  horariosPorDia: any = {};

  modalVisible = false;
  pacienteSeleccionado: any = null;

  diaHoy: string = '';
  fechaSeleccionada: string = '';

  constructor(private horarioService: HorarioService,
    private asistenciaService: AsistenciaService) { }

  ngOnInit(): void {
    this.obtenerFechaHoy();
    this.cargarHorariosDeFecha();
  }

  obtenerFechaHoy(): void {
    const fechaHoy = new Date();

    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    this.diaHoy = fechaHoy.toLocaleDateString('es-ES', opciones);

    const dia = fechaHoy.getDate().toString().padStart(2, '0');
    const mes = (fechaHoy.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaHoy.getFullYear();

    this.fechaSeleccionada = `${dia}-${mes}-${año}`;
  }

  cargarHorariosDeFecha(): void {
    this.horarioService.getHorariosPorSemana().subscribe((horariosPorDia: { [dia: string]: Horario[] }) => {
      this.horariosPorDia = horariosPorDia;
      console.log('Horarios de la semana:', this.horariosPorDia);
    });
  }

  onFechaChange(): void {
    if (this.fechaSeleccionada) {
      const [anio, mes, dia] = this.fechaSeleccionada.split('-');
      this.fechaSeleccionada = `${dia}-${mes}-${anio}`; // dd-MM-yyyy
      this.cargarHorariosDeFecha();
    }
  }

  registrarAsistencia(horario: Horario) {
    console.log('Registrando Asistencia del dia:', horario);
  }

  abrirModal(horario: any, dia: string): void {
    this.pacienteSeleccionado = {
      nombreCompleto: horario.nombre,
      hora: horario.hora,
      fecha: horario.fecha,
      pacienteId: horario.pacienteId,
      dia: dia, // Aquí guardamos el día que se pasa desde el template
    };
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
  }

  obtenerDiaDeHorario(horario: any): string {
    // Ahora simplemente devolvemos el día almacenado en el objeto horario
    return horario.dia || '';
  }

  procesarRespuesta(resultado: 'si' | 'no' | 'reprogramar') {
    if (!this.pacienteSeleccionado) return;

    if (resultado === 'si') {
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Asistió');
    } else if (resultado === 'no') {
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'No asistió');
    } else if (resultado === 'reprogramar') {
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Reprogramado');
      this.abrirModal(this.pacienteSeleccionado, this.pacienteSeleccionado.dia);
      return;
    }

    this.cerrarModal();
  }

  actualizarEstadoHorario(horarioSeleccionado: any, estado: string) {
    const dia = this.obtenerDiaDeHorario(horarioSeleccionado);

    if (!dia) {
      console.warn('No se pudo determinar el día para actualizar el horario');
      return;
    }

    const horarios = this.horariosPorDia[dia];
    if (!horarios || horarios.length === 0) {
      console.warn(`No hay horarios para el día: ${dia}`);
      return;
    }

    const nombreBuscar = horarioSeleccionado.nombreCompleto?.trim().toLowerCase();

    const index = horarios.findIndex((h: any) => {
      const nombreHorario = h.nombre?.trim().toLowerCase();
      return h.hora === horarioSeleccionado.hora && nombreHorario === nombreBuscar;
    });

    if (index !== -1) {
      horarios[index] = {
        ...horarios[index],
        estadoAsistencia: estado,
      };
      // Esto forza la detección de cambios y actualización del HTML
      this.horariosPorDia = { ...this.horariosPorDia };
    } else {
      console.warn('No se encontró el horario para actualizar:', horarioSeleccionado);
    }
  }
}

