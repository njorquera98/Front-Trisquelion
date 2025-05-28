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
  @Input() evaluacion: Evaluacion | null = null;
  @Input() modo: 'crear' | 'editar' | 'evaluaciones' = 'crear';

  @Output() evaluacionGuardada = new EventEmitter<Evaluacion>();
  @Output() cerrarModal = new EventEmitter<void>();
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
    if (!this.pacienteId) {
      this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.bonosService.getFoliosByPaciente(this.pacienteId).subscribe(bonos => {
      this.bonos = bonos.filter(bono => bono.sesionesDisponibles > 0);
      console.log('Bonos con sesiones disponibles:', this.bonos);
    });

    if ((this.modo === 'editar' || this.modo === 'crear') && this.evaluacion) {
      console.log('ngOnInit cargando evaluación en modo:', this.modo);
      this.cargarDatosEvaluacion();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges detectado:', changes);

    if (
      changes['evaluacion'] &&
      changes['evaluacion'].currentValue &&
      (this.modo === 'editar' || this.modo === 'crear')
    ) {
      console.log('ngOnChanges: evaluación actualizada en modo:', this.modo);
      this.cargarDatosEvaluacion();
    }
  }


  cargarDatosEvaluacion(): void {
    if (this.evaluacion) {
      console.log('Cargando evaluación:', this.evaluacion);

      this.objetivo = this.evaluacion.objetivo || '';
      this.diagnostico = this.evaluacion.diagnostico || '';
      this.anamnesis = this.evaluacion.anamnesis || '';

      this.bono_fk = this.evaluacion.bono?.bono_id ?? 0;

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
    this.objetivo = '';
    this.diagnostico = '';
    this.anamnesis = '';
    this.fechaIngreso = '';
    this.bono_fk = 0;
  }

  onSubmit(): void {
    const bonoSeleccionado = this.bonos.find(b => b.bono_id === Number(this.bono_fk)) || undefined;

    const evaluacionGuardada: Evaluacion = {
      ...(this.evaluacion ? { ...this.evaluacion } : {}),
      objetivo: this.objetivo,
      diagnostico: this.diagnostico,
      anamnesis: this.anamnesis,
      fechaIngreso: new Date(this.fechaIngreso),
      paciente_fk: this.pacienteId,
      bono_fk: Number(this.bono_fk),
      bono: bonoSeleccionado  // <--- fuerza actualización del bono
    };

    if (this.modo === 'crear') {
      delete (evaluacionGuardada as any).evaluacion_id;
    }

    if (this.modo === 'editar') {
      console.log('Emitiendo evaluación editada');
      this.evaluacionEditada.emit(evaluacionGuardada);
    } else {
      console.log('Emitiendo evaluación creada');
      this.evaluacionCreada.emit(evaluacionGuardada);
    }
  }


  cerrarModalFunc(): void {
    this.cerrarModal.emit();
  }
}
