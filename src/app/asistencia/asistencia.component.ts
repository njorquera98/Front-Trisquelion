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
  fechaSeleccionada: string = '';

  constructor(private horarioService: HorarioService) { }

  ngOnInit(): void {
    this.obtenerFechaHoy();
    this.cargarHorariosDeFecha();  // Cargar horarios al inicio con la fecha actual
  }

  obtenerFechaHoy(): void {
    const fechaHoy = new Date();

    // Usar 'toLocaleDateString' para mostrar la fecha completa
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    this.diaHoy = fechaHoy.toLocaleDateString('es-ES', opciones);

    // Formatear la fecha como dd-MM-yyyy para el input de tipo date
    const dia = fechaHoy.getDate().toString().padStart(2, '0');
    const mes = (fechaHoy.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaHoy.getFullYear();

    this.fechaSeleccionada = `${dia}-${mes}-${año}`; // Formato dd-MM-yyyy
  }

  cargarHorariosDeFecha(): void {
    if (this.fechaSeleccionada) {
      this.horarioService.getHorariosPorFecha(this.fechaSeleccionada).subscribe((horarios: any[]) => {
        this.horarios = horarios.sort((a, b) => a.hora.localeCompare(b.hora));
        console.log(`Horarios para ${this.fechaSeleccionada}:`, this.horarios);
      });
    }
  }

  // Método para manejar el cambio de fecha en el input
  onFechaChange(): void {
    if (this.fechaSeleccionada) {
      // La fecha viene en formato YYYY-MM-DD, y la convertimos a dd-MM-yyyy
      const [anio, mes, dia] = this.fechaSeleccionada.split('-');

      // Convertir a formato dd-MM-yyyy
      this.fechaSeleccionada = `${dia}-${mes}-${anio}`;

      this.cargarHorariosDeFecha();
    }
  }

}
