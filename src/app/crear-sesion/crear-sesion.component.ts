import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { ActivatedRoute } from '@angular/router';
import { Sesion } from '../models/sesion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../models/evaluacion.model';
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
  fecha: string = '';
  hora: string = '';
  descripcion: string = '';
  evaluaciones: Evaluacion[] = [];
  selectedEvaluacionId: number = 0;
  ultimoNumeroSesion: number = 0;
  errorMessage: string = '';
  showErrorAlert: boolean = false;
  bonoDisponible: boolean = false;

  @Output() sesionCreada: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private sesionService: SesionService,
    private evaluacionService: EvaluacionService,
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      console.log('Paciente ID asignado:', this.pacienteId); // Verifica si el valor de pacienteId es correcto
    });
  }

  ngOnInit(): void {
    this.getEvaluaciones();
    this.getLastSesion();
  }

  getEvaluaciones(): void {
    this.evaluacionService.getUltimaEvaluacionByPaciente(this.pacienteId).subscribe(
      (data: Evaluacion) => {
        this.evaluaciones = [data];
        console.log('Evaluaciones obtenidas:', this.evaluaciones);
      },
      (error: any) => {
        console.error('Error al obtener las evaluaciones:', error);
      }
    );
  }

  getLastSesion(): void {
    this.sesionService.getLastSesion(this.pacienteId).subscribe(
      (data: Sesion) => {
        this.ultimoNumeroSesion = data?.n_de_sesion ? data.n_de_sesion + 1 : 1;
      },
      (error: any) => {
        console.error('Error al obtener la última sesión:', error);
      }
    );
  }

  onEvaluacionChange(): void {
    console.log('onEvaluacionChange ejecutado');

    // Verifica si el valor seleccionado es un número y luego busca la evaluación
    const selectedEvaluacion: any = this.evaluaciones.find(
      evaluacion => evaluacion.evaluacion_id === Number(this.selectedEvaluacionId)
    );

    if (selectedEvaluacion) {
      console.log('Evaluación seleccionada:', selectedEvaluacion);

      // Accede dinámicamente a la propiedad 'bono'
      const bono = selectedEvaluacion.bono; // No genera error porque 'selectedEvaluacion' es de tipo 'any'

      if (bono) {
        const bonoId = bono.bono_id;

        // Consultar el bono usando bonoId para obtener las sesiones disponibles
        this.bonoService.getBonoById(bonoId).subscribe(
          (bonoData) => {
            console.log('Bono recibido:', bonoData);
            this.bonoDisponible = bonoData.sesionesDisponibles > 0; // Verificar si hay sesiones disponibles
            console.log('Bono disponible:', this.bonoDisponible);

            if (!this.bonoDisponible) {
              this.errorMessage = 'No hay sesiones disponibles en el bono de esta evaluación.';
              this.showErrorAlert = true;
            } else {
              this.showErrorAlert = false;
            }
          },
          (error) => {
            console.error('Error al verificar el bono:', error);
            this.errorMessage = 'Error al verificar el bono.';
            this.showErrorAlert = true;
          }
        );
      } else {
        console.error('El bono no está presente en la evaluación seleccionada.');
        this.errorMessage = 'La evaluación seleccionada no tiene un bono asociado.';
        this.showErrorAlert = true;
      }
    } else {
      console.log(`Evaluación no encontrada con ID: ${this.selectedEvaluacionId}`);
      this.errorMessage = 'Evaluación no encontrada.';
      this.showErrorAlert = true;
    }
  }

  onSubmit(): void {
    console.log('Inicio Paciente_id:', this.pacienteId);  // Verifica si el pacienteId tiene un valor correcto
    if (!this.pacienteId) {
      this.errorMessage = 'Paciente ID no disponible.';
      this.showErrorAlert = true;
      return;
    }
    console.log('Paciente_id:', this.pacienteId);
    console.log('Evaluación seleccionada ID:', this.selectedEvaluacionId);

    // Verificar si la evaluación seleccionada tiene un valor
    if (!this.selectedEvaluacionId) {
      this.errorMessage = 'Debe seleccionar una evaluación válida.';
      this.showErrorAlert = true;
      return;
    }

    // Buscar la evaluación seleccionada
    const selectedEvaluacion = this.evaluaciones.find(
      evaluacion => evaluacion.evaluacion_id === Number(this.selectedEvaluacionId)
    );

    if (!selectedEvaluacion) {
      console.error('Evaluación no encontrada:', this.selectedEvaluacionId);
      this.errorMessage = 'Debe seleccionar una evaluación válida.';
      this.showErrorAlert = true;
      return;
    }

    // Acceder a la propiedad 'bono' de forma segura
    const bono = (selectedEvaluacion as { bono?: any }).bono;

    if (!bono) {
      this.errorMessage = 'La evaluación seleccionada no tiene un bono asociado.';
      this.showErrorAlert = true;
      return;
    }

    console.log('Bono de la evaluación:', bono);
    console.log('Bono_fk de la evaluación:', bono?.bono_id);

    // Verificar si hay sesiones disponibles en el bono
    if (!this.bonoDisponible) {
      this.errorMessage = 'No hay sesiones disponibles en el bono de esta evaluación.';
      this.showErrorAlert = true;
      return;
    }

    // Crear el objeto de sesión
    const sesionData: Sesion = {
      fecha: new Date(this.fecha),
      hora: this.hora,
      descripcion: this.descripcion,
      tipo_sesion: this.tipo_sesion,
      paciente_fk: this.pacienteId, // Asegúrate de que pacienteId tiene el valor correcto
      n_de_sesion: this.ultimoNumeroSesion,
      evaluacion_fk: this.selectedEvaluacionId, // ID de la evaluación seleccionada
      bono_fk: bono?.bono_id // Accede correctamente al bono_id
    };

    console.log('SesionData que se va a enviar:', sesionData);

    // Enviar la solicitud para crear la sesión
    this.sesionService.createSesion(sesionData).subscribe(
      () => {
        this.sesionCreada.emit();
        this.showErrorAlert = false;
      },
      () => {
        this.errorMessage = 'Hubo un error al crear la sesión.';
        this.showErrorAlert = true;
      }
    );
  }

}
