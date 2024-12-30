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
  n_folio: string = '';
  fecha: string = '';
  hora: string = '';
  descripcion: string = '';
  folios: any[] = [];
  ultimoNumeroSesion: number = 0;
  selectedBonoId: number = 0;
  errorMessage: string = ''; // Para mostrar el mensaje de error
  showErrorAlert: boolean = false; // Para controlar la visibilidad de la alerta

  @Output() sesionCreada: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private sesionService: SesionService,
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      this.getFolios();
      this.getLastSesion();
    });
  }

  getFolios(): void {
    this.bonoService.getFoliosByPaciente(this.pacienteId).subscribe(
      (data: any[]) => {
        this.folios = data;
      },
      (error) => {
        console.error('Error al obtener los folios:', error);
      }
    );
  }

  getLastSesion(): void {
    this.sesionService.getLastSesion(this.pacienteId).subscribe(
      (data: Sesion) => {
        if (data && data.n_de_sesion) {
          this.ultimoNumeroSesion = data.n_de_sesion + 1;
        } else {
          this.ultimoNumeroSesion = 1;
        }
      },
      (error) => {
        console.error('Error al obtener la última sesión:', error);
      }
    );
  }

  onSubmit(): void {
    // Obtener el bono seleccionado
    const selectedBono = this.folios.find(bono => bono.bono_id === this.selectedBonoId);

    // Verificar si el bono tiene sesiones disponibles
    if (selectedBono && selectedBono.sesionesDisponibles <= 0) {
      this.errorMessage = 'Este bono no tiene sesiones disponibles.';
      this.showErrorAlert = true;  // Mostrar alerta en el frontend
      return;  // Detener el envío del formulario
    }

    // Si el bono tiene sesiones disponibles, continuar con la creación de la sesión
    const sesionData: Sesion = {
      fecha: new Date(this.fecha),
      hora: this.hora,
      descripcion: this.descripcion,
      tipo_sesion: this.tipo_sesion,
      paciente_fk: this.pacienteId,
      n_de_sesion: this.ultimoNumeroSesion,
      bono_fk: this.selectedBonoId
    };

    // Realizar la solicitud HTTP solo si el bono tiene sesiones disponibles
    this.sesionService.createSesion(sesionData).subscribe(
      (response: Sesion) => {
        this.sesionCreada.emit();
        this.showErrorAlert = false; // Ocultar alerta si la sesión fue creada con éxito
      },
      (error: any) => {
        // En caso de error del backend, mostrar un mensaje genérico
        this.errorMessage = 'Error al crear la sesión. Por favor intente nuevamente.';
        this.showErrorAlert = true;
      }
    );
  }

}
