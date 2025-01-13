import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Evaluacion } from '../models/evaluacion.model';
import { EvaluacionService } from '../services/evaluacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluaciones-pasadas',
  imports: [CommonModule],
  templateUrl: './evaluaciones-pasadas.component.html',
  styleUrl: './evaluaciones-pasadas.component.css'
})
export class EvaluacionesPasadasComponent implements OnInit {
  @Input() pacienteId!: number;
  @Input() evaluaciones: Evaluacion[] = [];
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  constructor(private evaluacionesService: EvaluacionService) { }

  ngOnInit(): void {
    this.obtenerEvaluacionesPasadas();
  }

  // Método para obtener las evaluaciones pasadas del paciente
  obtenerEvaluacionesPasadas(): void {
    this.evaluacionesService.getEvaluacionesByPaciente(this.pacienteId).subscribe(
      (evaluaciones: Evaluacion[]) => {
        this.evaluaciones = evaluaciones;
      },
      error => {
        console.error('Error al obtener las evaluaciones pasadas:', error);
      }
    );
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.closeModal.emit(); // Emite el evento para cerrar el modal
  }
}
