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

  constructor(
    private horarioService: HorarioService,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit(): void {
    this.obtenerFechaHoy();
    this.cargarHorariosDeFecha();
  }

  obtenerFechaHoy(): void {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    this.diaHoy = hoy.toLocaleDateString('es-ES', opciones);

    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const año = hoy.getFullYear();

    this.fechaSeleccionada = `${dia}-${mes}-${año}`;
  }

  cargarHorariosDeFecha(): void {
    this.horarioService.getHorariosPorSemana().subscribe((horariosPorDia: { [dia: string]: Horario[] }) => {
      this.horariosPorDia = horariosPorDia;
    });
  }

  onFechaChange(): void {
    if (this.fechaSeleccionada) {
      const [anio, mes, dia] = this.fechaSeleccionada.split('-');
      this.fechaSeleccionada = `${dia}-${mes}-${anio}`;
      this.cargarHorariosDeFecha();
    }
  }

  obtenerFechaDelDia(dia: string): string {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const hoy = new Date();
    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const indiceDiaObjetivo = diasSemana.indexOf(dia.toLowerCase());
    if (indiceDiaObjetivo === -1) return '';

    const diaActual = hoyLocal.getDay();

    let diferencia = indiceDiaObjetivo - diaActual;
    if (diferencia < 0) diferencia += 7;

    const fechaObjetivo = new Date(hoyLocal);
    fechaObjetivo.setDate(hoyLocal.getDate() + diferencia);

    const diaStr = fechaObjetivo.getDate().toString().padStart(2, '0');
    const mesStr = (fechaObjetivo.getMonth() + 1).toString().padStart(2, '0');
    const anioStr = fechaObjetivo.getFullYear();

    return `${diaStr}-${mesStr}-${anioStr}`;
  }

  abrirModal(horario: any, dia: string): void {
    const fechaCalculada = this.obtenerFechaDelDia(dia);

    this.pacienteSeleccionado = {
      nombreCompleto: horario.nombre,
      hora: horario.hora,
      fecha: fechaCalculada,
      pacienteId: horario.pacienteId,
      dia: dia,
    };

    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
  }

  obtenerDiaDeHorario(horario: any): string {
    return horario.dia || '';
  }

  procesarRespuesta(resultado: 'si' | 'no' | 'suspende' | 'reprogramar') {
    if (!this.pacienteSeleccionado) return;

    const { nombreCompleto, dia, hora, fecha } = this.pacienteSeleccionado;

    // Convertir dd-mm-yyyy a yyyy-mm-dd para parseo
    let fechaTransformada = fecha;
    if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
      const [diaStr, mesStr, anioStr] = fecha.split('-');
      fechaTransformada = `${anioStr}-${mesStr}-${diaStr}`;
    }

    // Crear fecha local evitando desfase horario
    const [anioStr, mesStr, diaStr] = fechaTransformada.split('-');
    const fechaObj = new Date(Number(anioStr), Number(mesStr) - 1, Number(diaStr));

    // Formatear fecha dd-mm-yy
    const diaF = fechaObj.getDate().toString().padStart(2, '0');
    const mesF = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anioF = fechaObj.getFullYear().toString().slice(-2);

    const fechaCorta = `${diaF}-${mesF}-${anioF}`;

    if (resultado === 'si') {
      console.log(`✅ Paciente ${nombreCompleto} asistió el día ${fechaCorta} en el horario ${hora}`);
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Si Asiste');
    }

    else if (resultado === 'no') {
      console.log(`❌ Paciente ${nombreCompleto} NO asistió el día ${fechaCorta} en el horario ${hora}`);
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'No Asiste');
    }

    else if (resultado === 'suspende') {
      console.log(`❌ Paciente ${nombreCompleto} suspendió el día ${fechaCorta} en el horario ${hora}`);
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Suspendido');
    }
    else if (resultado === 'reprogramar') {
      console.log(`🔁 Paciente ${nombreCompleto} reprogramó su asistencia del día ${fechaCorta} en el horario ${hora}`);
      this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Reprogramado');
    }
    this.abrirModal(this.pacienteSeleccionado, dia);


    this.cerrarModal();
  }

  actualizarEstadoHorario(horarioSeleccionado: any, estado: string) {
    const dia = this.obtenerDiaDeHorario(horarioSeleccionado);

    if (!dia) return;

    const horarios = this.horariosPorDia[dia];
    if (!horarios) return;

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
      this.horariosPorDia = { ...this.horariosPorDia };
    }
  }

  getFechaDelDiaSemana(dia: string): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 = domingo

    const offset = diasSemana.indexOf(dia) - ((diaActual + 6) % 7);
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + offset);

    const diaNumero = fecha.getDate();
    return `${dia} ${diaNumero}`;
  }

  procesarReprogramacion(data: { fecha: string; hora: string }) {
    if (!this.pacienteSeleccionado) return;

    const { nombreCompleto, fecha: fechaOriginal, hora: horaOriginal } = this.pacienteSeleccionado;

    console.log(`🔁 Paciente ${nombreCompleto} REPROGRAMÓ su asistencia`);
    console.log(`📆 De: ${fechaOriginal} a ${data.fecha}`);
    console.log(`🕒 De: ${horaOriginal} a ${data.hora}`);

    this.actualizarEstadoHorario(this.pacienteSeleccionado, 'Reprogramado');

    // Aquí podrías agregar lógica adicional para actualizar backend o interfaz, si es necesario
  }

}

