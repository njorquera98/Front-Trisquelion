import { Component, Input, OnInit } from '@angular/core';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../models/evaluacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CrearEvaluacionComponent } from '../crear-evaluacion/crear-evaluacion.component';

@Component({
  selector: 'app-evaluacion',
  imports: [CommonModule, FormsModule, CrearEvaluacionComponent],
  templateUrl: './evaluacion.component.html',
  styleUrl: './evaluacion.component.css'
})
export class EvaluacionComponent implements OnInit {
  evaluacion: Evaluacion | null = null;
  @Input() pacienteId!: number;
  mostrarModal = false;

  constructor(
    private evaluacionService: EvaluacionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener la última evaluación del paciente
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    this.getLastEvaluacion();

  }

  getLastEvaluacion(): void {
    this.evaluacionService.getLastEvaluacionByPaciente(this.pacienteId).subscribe(
      (data) => {
        this.evaluacion = data;
      },
      (error) => {
        console.error('Error al obtener la última evaluación', error);
      }
    );
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarEvaluacion(nuevaEvaluacion: Evaluacion) {
    this.evaluacionService.createEvaluacion(nuevaEvaluacion).subscribe(
      (data) => {
        console.log('Evaluación guardada:', data);
        this.evaluacion = data; // Para que se actualice con la nueva evaluación
        this.cerrarModal();  // Cerrar el modal después de guardar
      },
      (error) => {
        console.error('Error al guardar evaluación:', error);
      }
    );
  }
}
