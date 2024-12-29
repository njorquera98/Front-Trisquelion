import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { ActivatedRoute } from '@angular/router';
import { Sesion } from '../models/sesion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bono } from '../models/bono.model';
import { BonoService } from '../services/bono.service';

@Component({
  selector: 'app-crear-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-sesion.component.html',
  styleUrl: './crear-sesion.component.css'
})
export class CrearSesionComponent implements OnInit {
  pacienteId: number = 0;
  tipo_sesion: string = '';
  n_folio: string = '';  // Este es solo un valor temporal para el formulario
  fecha: string = '';
  hora: string = '';
  descripcion: string = '';
  folios: Bono[] = [];
  ultimoNumeroSesion: number = 0;  // Para guardar el último número de sesión
  selectedBonoId: number = 0;  // Para guardar el bono seleccionado

  @Output() sesionCreada: EventEmitter<void> = new EventEmitter<void>(); // Evento para notificar que la sesión se guardó

  constructor(
    private sesionService: SesionService,
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    // Obtener el pacienteId desde la URL
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
    });
  }

  ngOnInit(): void {
    // Obtener el pacienteId desde la URL
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      // Obtener los folios de los bonos del paciente
      this.getFolios();
      // Obtener la última sesión
      this.getLastSesion();
    });
  }

  getFolios(): void {
    this.bonoService.getFoliosByPaciente(this.pacienteId).subscribe(
      (data: Bono[]) => {
        this.folios = data; // Almacenar los folios en el array
      },
      (error) => {
        console.error('Error al obtener los folios:', error);
      }
    );
  }

  // Obtener la última sesión y calcular el número de sesión
  getLastSesion(): void {
    this.sesionService.getLastSesion(this.pacienteId).subscribe(
      (data: Sesion) => {
        if (data && data.n_de_sesion) {
          this.ultimoNumeroSesion = data.n_de_sesion + 1;  // Incrementar en 1 para la siguiente sesión
        } else {
          this.ultimoNumeroSesion = 1;  // Si no hay sesiones anteriores, iniciar con 1
        }
      },
      (error) => {
        console.error('Error al obtener la última sesión:', error);
      }
    );
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    const sesionData: Sesion = {
      fecha: new Date(this.fecha),
      hora: this.hora,
      descripcion: this.descripcion,
      tipo_sesion: this.tipo_sesion,
      paciente_fk: this.pacienteId,
      n_de_sesion: this.ultimoNumeroSesion,  // Asignar el número de sesión calculado
      bono_fk: this.selectedBonoId  // Asignar el bono seleccionado
    };

    // Llamar al servicio para crear la sesión
    this.sesionService.createSesion(sesionData).subscribe(
      (response: Sesion) => {
        this.sesionCreada.emit();  // Emitir el Evento
      },
      (error: any) => {
        console.error('Error al crear la sesión:', error);
      }
    );
  }
}

