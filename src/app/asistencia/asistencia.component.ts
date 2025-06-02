import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario.model';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  // Días y horas fijas para construir la tabla
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  horasDelDia: string[] = [
    '09:00:00', '09:30:00', '10:00:00', '11:00:00',
    '14:00:00', '14:30:00', '15:00:00',
    '17:00:00', '18:00:00', '19:30:00'
  ];
  horariosPorDia: any = {};

  // Datos traídos del backend
  //horariosPorDia: { [key: string]: Horario[] } = {};

  // Variables de control de fecha (no se usan directamente para esta vista, pero se mantienen por si agregas input date)
  diaHoy: string = '';
  fechaSeleccionada: string = '';

  constructor(private horarioService: HorarioService) { }

  ngOnInit(): void {
    this.obtenerFechaHoy();
    this.cargarHorariosDeFecha();  // Cargar la semana completa al inicio
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

  // Este método es opcional si decides usar un <input type="date"> para filtrar por día
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
}


