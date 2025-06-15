import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarAsistenciaComponent } from '../confirmar-asistencia/confirmar-asistencia.component';
import { AsistenciaService } from '../services/asistencia.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmarAsistenciaComponent],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css',
})
export class AsistenciaComponent implements OnInit {
  diasMostrarFechas: { nombre: string; fecha: Date }[] = [];
  horariosPorDia: { [key: string]: any[] } = {};

  diaHoy: string = '';
  modalVisible = false;
  pacienteSeleccionado: any = null;

  diasPrimeraSemana: { nombre: string; fecha: Date }[] = [];
  diasSegundaSemana: { nombre: string; fecha: Date }[] = [];

  constructor(private asistenciaService: AsistenciaService) { }

  ngOnInit() {
    this.generarDiasMostrar();
    this.dividirDiasEnDosFilas();
    this.cargarAsistenciasDosSemanas();

    this.diaHoy = this.obtenerDiaSemanaTexto(new Date());
  }

  dividirDiasEnDosFilas() {
    const mitad = Math.ceil(this.diasMostrarFechas.length / 2);
    this.diasPrimeraSemana = this.diasMostrarFechas.slice(0, mitad);
    this.diasSegundaSemana = this.diasMostrarFechas.slice(mitad);
  }

  obtenerFechaDelDiaSemana(clave: string): string {
    const index = parseInt(clave.split('_')[1], 10);
    const diaObj = this.diasMostrarFechas[index];
    if (!diaObj) return '';

    return this.formatFecha(diaObj.fecha);
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

  cargarAsistenciasDosSemanas() {
    const inicio = this.getLunesDeEstaSemana();
    const fin = this.getSabadoDeSemanaSiguiente();

    const inicioStr = format(inicio, 'yyyy-MM-dd');
    const finStr = format(fin, 'yyyy-MM-dd');

    console.log('Cargando asistencias desde', inicioStr, 'hasta', finStr);

    this.asistenciaService.getAsistenciasRango(inicioStr, finStr).subscribe({
      next: (asistencias) => {
        console.log('Asistencias recibidas:', asistencias);
        this.organizarPorDia(asistencias);
      },
      error: (err) => {
        console.error('Error cargando asistencias:', err);
      },
    });
  }

  // Nueva función para parsear fechas sin desfase horario
  parseDateSinZona(fechaString: string): Date {
    const partes = fechaString.split('-').map(Number);
    // new Date(año, mesIndex, día)
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  organizarPorDia(asistencias: any[]) {
    this.horariosPorDia = {};

    this.diasMostrarFechas.forEach((diaObj, i) => {
      const key = diaObj.nombre + '_' + i;
      this.horariosPorDia[key] = [];
    });

    for (const asistencia of asistencias) {
      // Uso parseDateSinZona para evitar desfase
      const fecha = this.parseDateSinZona(asistencia.fecha);
      const fechaStr = format(fecha, 'yyyy-MM-dd');

      this.diasMostrarFechas.forEach((diaObj, i) => {
        const key = diaObj.nombre + '_' + i;
        const fechaDiaStr = format(diaObj.fecha, 'yyyy-MM-dd');

        if (fechaStr === fechaDiaStr) {
          this.horariosPorDia[key].push(asistencia);
        }
      });
    }

    console.log('horariosPorDia', this.horariosPorDia);
  }

  obtenerDiaSemanaTexto(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
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
    sabadoSiguiente.setDate(lunes.getDate() + 11);
    sabadoSiguiente.setHours(23, 59, 59, 999);
    return sabadoSiguiente;
  }

  formatFecha(fecha: Date): string {
    return format(fecha, 'dd/MM/yyyy');
  }

  abrirModal(horario: any, diaConIndice: string) {
    this.pacienteSeleccionado = horario.paciente;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pacienteSeleccionado = null;
  }

  procesarRespuesta(event: any) {
    console.log('Respuesta modal:', event);
    this.cargarAsistenciasDosSemanas();
    this.cerrarModal();
  }

  procesarReprogramacion(event: any) {
    console.log('Reprogramar:', event);
    this.cargarAsistenciasDosSemanas();
    this.cerrarModal();
  }
}

