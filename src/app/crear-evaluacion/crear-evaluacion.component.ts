import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Evaluacion } from '../models/evaluacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BonoService } from '../services/bono.service';
import { Bono } from '../models/bono.model';

@Component({
  selector: 'app-crear-evaluacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-evaluacion.component.html',
  styleUrls: ['./crear-evaluacion.component.css']
})
export class CrearEvaluacionComponent implements OnInit {
  @Input() pacienteId!: number;
  @Input() evaluacion: Evaluacion | null = null; // Evaluación para edición
  @Input() modo: 'crear' | 'editar' | 'evaluaciones' = 'crear'; // Modo de operación: crear, editar o ver evaluaciones
  @Output() evaluacionGuardada = new EventEmitter<Evaluacion>(); // Evento para guardar evaluación
  @Output() cerrarModal = new EventEmitter<void>(); // Evento para cerrar modal

  @Output() evaluacionCreada = new EventEmitter<Evaluacion>();
  @Output() evaluacionEditada = new EventEmitter<Evaluacion>();

  bonos: Bono[] = [];
  bono_fk: number = 0;
  objetivo: string = '';
  diagnostico: string = '';
  anamnesis: string = '';
  fechaIngreso: string = '';
  bono: Bono | null = null;

  constructor(
    private bonosService: BonoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Si no se pasa un paciente ID, lo obtenemos desde la ruta
    if (!this.pacienteId) {
      this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    }

    // Cargar los bonos del paciente
    this.bonosService.getFoliosByPaciente(this.pacienteId).subscribe(bonos => {
      this.bonos = bonos;
    });

    // Si estamos en modo editar y se pasa una evaluación, cargarla
    if (this.modo === 'editar' && this.evaluacion) {
      this.cargarDatosEvaluacion();
    } else if (this.modo === 'crear') {
      this.reiniciarFormulario();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
    if (changes['evaluacion'] && changes['evaluacion'].currentValue && this.modo === 'editar') {
      this.cargarDatosEvaluacion();
    } else if (this.modo === 'crear') {
      this.reiniciarFormulario();
    }
  }

  cargarDatosEvaluacion(): void {
    if (this.evaluacion) {
      console.log('Evaluación cargada:', this.evaluacion);
      this.objetivo = this.evaluacion.objetivo || '';
      this.diagnostico = this.evaluacion.diagnostico || '';
      this.anamnesis = this.evaluacion.anamnesis || '';

      // Verificar si existe bono y bono_id
      if (this.evaluacion.bono && this.evaluacion.bono.bono_id) {
        this.bono_fk = this.evaluacion.bono.bono_id; // Ahora bono_id está garantizado
        console.log('bono_fk:', this.bono_fk);
      } else {
        this.bono_fk = 0; // Si no existe bono, lo asignamos a 0 o un valor predeterminado
        console.log('No se encontró bono');
      }

      // Conversión de fecha
      if (typeof this.evaluacion.fechaIngreso === 'string') {
        this.fechaIngreso = new Date(this.evaluacion.fechaIngreso).toISOString().split('T')[0];
      } else if (this.evaluacion.fechaIngreso instanceof Date) {
        this.fechaIngreso = this.evaluacion.fechaIngreso.toISOString().split('T')[0];
      } else {
        this.fechaIngreso = new Date().toISOString().split('T')[0];
      }
    }
  }

  reiniciarFormulario(): void {
    // Reiniciar los campos del formulario
    this.objetivo = '';
    this.diagnostico = '';
    this.anamnesis = '';
    this.fechaIngreso = '';
    this.bono_fk = 0;
  }

  onSubmit(): void {
    console.log('evaluacionGuardada antes de emitir:', {
      ...this.evaluacion,
      objetivo: this.objetivo,
      diagnostico: this.diagnostico,
      anamnesis: this.anamnesis,
      fechaIngreso: new Date(this.fechaIngreso), // Convierte aquí a un objeto Date
      paciente_fk: this.pacienteId,
      bono_fk: this.bono_fk
    });

    const evaluacionGuardada: Evaluacion = {
      ...this.evaluacion,
      objetivo: this.objetivo,
      diagnostico: this.diagnostico,
      anamnesis: this.anamnesis,
      fechaIngreso: new Date(this.fechaIngreso),
      paciente_fk: this.pacienteId,
      bono_fk: this.bono_fk
    };

    if (this.modo === 'editar') {
      console.log('Emitiendo evaluación editada');
      this.evaluacionEditada.emit(evaluacionGuardada);
    } else {
      console.log('Emitiendo evaluación creada');
      this.evaluacionCreada.emit(evaluacionGuardada);
    }
  }


  cerrarModalFunc(): void {
    // Emitir el evento para cerrar el modal
    this.cerrarModal.emit();
  }
}
