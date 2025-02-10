import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  isEditMode: boolean = false;

  @Output() sesionActualizada: EventEmitter<void> = new EventEmitter<void>();
  @Output() sesionCreada: EventEmitter<void> = new EventEmitter<void>();
  @Input() sesion: Sesion | null | undefined;

  constructor(
    private sesionService: SesionService,
    private evaluacionService: EvaluacionService,
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
      console.log('Paciente ID asignado:', this.pacienteId);
    });
  }

  ngOnInit(): void {
    this.getEvaluaciones();

    // Determinar si estamos editando una sesión
    if (this.sesion) {
      this.isEditMode = true;
      console.log('Modo edición activado:', this.sesion);
    } else {
      this.isEditMode = false;
      this.getLastSesion();
      console.log('Modo creación activado.');
    }
  }
  checkSesionesDisponibles(bono: any): void {
    const bonoId = bono.bono_id;
    this.bonoService.getBonoById(bonoId).subscribe(
      (bonoData) => {
        console.log('Bono recibido:', bonoData);
        const sesionesDisponibles = Number(bonoData.cantidad);
        console.log('Sesiones disponibles como número:', sesionesDisponibles);

        if (sesionesDisponibles > 0) {
          this.bonoDisponible = true;
          console.log('Bono disponible, sesiones restantes:', sesionesDisponibles);
        } else {
          this.bonoDisponible = false;
          console.log('No hay sesiones disponibles.');
        }

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
  }

  getEvaluaciones(): void {
    console.log('Solicitando evaluaciones para paciente ID:', this.pacienteId);

    this.evaluacionService.getUltimaEvaluacionByPaciente(this.pacienteId).subscribe(
      (data: Evaluacion) => {
        this.evaluaciones = [data]; // Cargar la última evaluación en la lista
        console.log('Última evaluación recibida:', data);

        // Asignar el ID de la evaluación recibida a selectedEvaluacionId
        if (data.evaluacion_id !== undefined) {
          this.selectedEvaluacionId = data.evaluacion_id;
          console.log('Selected Evaluacion ID asignado:', this.selectedEvaluacionId);
        } else {
          console.warn('Evaluación no tiene un ID válido');
          this.selectedEvaluacionId = 0; // Asignamos un valor por defecto si no es válido
        }

        // Acceso dinámico a la propiedad bono usando "any"
        const bono = (data as any).bono; // Cast a 'any' para acceder a la propiedad bono
        if (bono) {
          console.log('Bono recibido:', bono);
          this.checkSesionesDisponibles(bono);
        } else {
          console.warn('No se encontró un bono asociado a esta evaluación.');
        }
      },
      (error: any) => {
        console.error('Error al obtener las evaluaciones:', error);
      }
    );
  }



  getLastSesion(): void {
    this.sesionService.getLastSesion(this.pacienteId).subscribe(
      (data: Sesion) => {
        console.log('Sesion recibida:', data); // Verificar contenido de la sesión
        this.sesion = data;
        this.ultimoNumeroSesion = data?.n_de_sesion ? data.n_de_sesion + 1 : 1;
      },
      (error: any) => {
        console.error('Error al obtener la última sesión:', error);
      }
    );
  }

  onEvaluacionChange(): void {
    console.log('onEvaluacionChange ejecutado');

    const selectedEvaluacion: any = this.evaluaciones.find(
      evaluacion => evaluacion.evaluacion_id === Number(this.selectedEvaluacionId)
    );

    if (selectedEvaluacion) {
      console.log('Evaluación seleccionada:', selectedEvaluacion);

      const bono = selectedEvaluacion.bono;

      console.log('Valor bono', bono);

      if (bono) {
        const bonoId = bono.bono_id;

        this.bonoService.getBonoById(bonoId).subscribe(
          (bonoData) => {
            console.log('Bono recibido:', bonoData);
            console.log('Cantidad de sesiones disponibles:', bonoData.cantidad);

            this.bonoDisponible = Number(bonoData.cantidad) > 0;
            console.log('¿Bono disponible?:', this.bonoDisponible);

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

  ngOnChanges(): void {
    if (this.sesion) {
      console.log('Cargando datos de la sesión para edición:', this.sesion);

      // Asignar los valores de la sesión al formulario
      this.fecha = this.sesion.fecha ? new Date(this.sesion.fecha).toISOString().slice(0, 10) : ''; // Fecha en formato YYYY-MM-DD
      this.hora = this.sesion.hora || '';
      this.descripcion = this.sesion.descripcion || '';
      this.tipo_sesion = this.sesion.tipo_sesion || '';
      this.selectedEvaluacionId = this.sesion.evaluacion_fk ?? 0;
    }
  }


  updateEvaluacionId(): void {
    this.getLastSesion();
  }


  onSubmit(): void {
    console.log('Inicio Paciente_id:', this.pacienteId);

    if (!this.pacienteId) {
      this.errorMessage = 'Paciente ID no disponible.';
      this.showErrorAlert = true;
      return;
    }

    if (!this.selectedEvaluacionId) {
      this.errorMessage = 'Debe seleccionar una evaluación válida.';
      this.showErrorAlert = true;
      return;
    }

    if (!this.bonoDisponible) {
      this.errorMessage = 'No hay sesiones disponibles.';
      this.showErrorAlert = true;
      return;
    }

    const selectedEvaluacion = this.evaluaciones.find(
      evaluacion => evaluacion.evaluacion_id === Number(this.selectedEvaluacionId)
    );

    const bono = (selectedEvaluacion as { bono?: any }).bono;

    const sesionData: Sesion = {
      fecha: new Date(this.fecha),
      hora: this.hora,
      descripcion: this.descripcion,
      tipo_sesion: this.tipo_sesion,
      paciente_fk: this.pacienteId,
      n_de_sesion: this.isEditMode ? this.sesion?.n_de_sesion || 1 : this.ultimoNumeroSesion,
      evaluacion_fk: this.selectedEvaluacionId,
      bono_fk: bono?.bono_id,
      sesion_id: this.isEditMode ? this.sesion?.sesion_id : undefined // Mantener el ID en caso de edición
    };

    if (this.isEditMode) {
      if (!this.sesion?.sesion_id) {
        console.error('Error: No se proporcionó un ID de sesión para la actualización.');
        return;
      }

      this.sesionService.updateSesion(this.sesion.sesion_id, sesionData).subscribe(
        () => {
          console.log('Sesión actualizada con éxito.');
          this.sesionCreada.emit(); // Emitir evento al actualizar
          this.showErrorAlert = false;
        },
        (error) => {
          console.error('Error al actualizar la sesión:', error);
          this.errorMessage = 'Hubo un error al actualizar la sesión.';
          this.showErrorAlert = true;
        }
      );
    }

    else {
      // Modo creación
      console.log('Creando nueva sesión:', sesionData);
      this.sesionService.createSesion(sesionData).subscribe(
        () => {
          console.log('Sesión creada con éxito.');
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
}
