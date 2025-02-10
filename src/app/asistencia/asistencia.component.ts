import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../services/horario.service';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  horarios: any[] = [];
  diaHoy: string = '';

  constructor(private horarioService: HorarioService) { }

  ngOnInit(): void {
    this.cargarHorariosDeHoy();
    this.obtenerDiaDeHoy();
  }

  cargarHorariosDeHoy(): void {
    this.horarioService.obtenerHorariosDeHoy().subscribe((horarios) => {
      // Ordenar los horarios por hora
      this.horarios = horarios.sort((a, b) => {
        const horaA = a.hora.split(':').join('');
        const horaB = b.hora.split(':').join('');
        return horaA > horaB ? 1 : horaA < horaB ? -1 : 0;
      });
      console.log('Horarios de hoy:', this.horarios);
    });
  }

  obtenerDiaDeHoy(): void {
    const fechaHoy = new Date();
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dia = fechaHoy.getDate();
    const mes = meses[fechaHoy.getMonth()];
    const año = fechaHoy.getFullYear();

    this.diaHoy = `${diasSemana[fechaHoy.getDay()]} ${dia} de ${mes} de ${año}`;
  }
}
