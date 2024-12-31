import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Evaluacion } from '../models/evaluacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-evaluacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-evaluacion.component.html',
  styleUrls: ['./crear-evaluacion.component.css']
})
export class CrearEvaluacionComponent implements OnInit {
  @Input() pacienteId!: number;
  @Output() evaluacionCreada = new EventEmitter<Evaluacion>();
  objetivo: string = '';
  diagnostico: string = '';
  anamnesis: string = '';
  fechaIngreso: string = '';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Captura el ID del paciente desde la URL
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit(): void {
    const nuevaEvaluacion = {
      objetivo: this.objetivo,
      diagnostico: this.diagnostico,
      anamnesis: this.anamnesis,
      fechaIngreso: this.fechaIngreso,
      paciente_fk: this.pacienteId
    };

    this.evaluacionCreada.emit(nuevaEvaluacion);  // Emitir el evento con la evaluación
  }
}

