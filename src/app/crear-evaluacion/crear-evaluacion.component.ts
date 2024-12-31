import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() evaluacionCreada = new EventEmitter<Evaluacion>();


  bonos: Bono[] = [];
  bono_fk: number = 0;
  objetivo: string = '';
  diagnostico: string = '';
  anamnesis: string = '';
  fechaIngreso: string = '';

  constructor(
    private bonosService: BonoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    this.bonosService.getFoliosByPaciente(this.pacienteId).subscribe(bonos => {
      this.bonos = bonos;
    });
  }

  onSubmit(): void {
    const nuevaEvaluacion: Evaluacion = {
      objetivo: this.objetivo,
      diagnostico: this.diagnostico,
      anamnesis: this.anamnesis,
      fechaIngreso: this.fechaIngreso,
      paciente_fk: this.pacienteId,
      bono_fk: this.bono_fk
    };

    // Emitir el evento con la nueva evaluación
    this.evaluacionCreada.emit(nuevaEvaluacion);
  }
}

