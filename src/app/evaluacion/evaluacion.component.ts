import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../models/evaluacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CrearEvaluacionComponent } from '../crear-evaluacion/crear-evaluacion.component';
import { EvaluacionesPasadasComponent } from '../evaluaciones-pasadas/evaluaciones-pasadas.component';

@Component({
  selector: 'app-evaluacion',
  imports: [CommonModule, FormsModule, CrearEvaluacionComponent, EvaluacionesPasadasComponent],
  templateUrl: './evaluacion.component.html',
  styleUrl: './evaluacion.component.css'
})
export class EvaluacionComponent implements OnInit {
  @Input() pacienteId!: number; // ID del paciente
  evaluacionSeleccionada: Evaluacion | null = null; // Evaluación seleccionada para editar
  evaluacion: Evaluacion | null = null; // Última evaluación
  mostrarModal: boolean = false; // Estado para mostrar/ocultar el modal
  modalTipo: 'crear' | 'editar' | 'evaluaciones' = 'crear'; // Tipo de modal
  evaluacionesPasadas: Evaluacion[] = []; // Evaluaciones pasadas
  @Output() evaluacionCreada = new EventEmitter<Evaluacion>(); // Evento para cuando se crea una evaluación
  @Output() evaluacionEditada = new EventEmitter<Evaluacion>(); // Evento para cuando se edita una evaluación
  modo: 'crear' | 'editar' | 'evaluaciones' = 'crear'; // Propiedad 'modo' para gestionar el tipo de operación
  ultimaEvaluacion: Evaluacion | null = null;

  constructor(
    private evaluacionService: EvaluacionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const pacienteIdFromRoute = this.route.snapshot.paramMap.get('id');
    if (pacienteIdFromRoute) {
      this.pacienteId = Number(pacienteIdFromRoute);
      this.getLastEvaluacion();
    } else {
      console.error('Paciente ID no encontrado en la ruta');
    }
  }

  // Obtener la última evaluación del paciente
  getLastEvaluacion(): void {
    this.evaluacionService.getUltimaEvaluacionByPaciente(this.pacienteId).subscribe(
      (data) => {
        this.evaluacion = data;
      },
      (error) => {
        console.error('Error al obtener la última evaluación:', error);
      }
    );
  }

  // Abrir modal para crear, editar o ver evaluaciones pasadas
  async abrirModal(tipo: 'crear' | 'editar' | 'evaluaciones', evaluacion?: Evaluacion): Promise<void> {
    this.modalTipo = tipo;
    this.ultimaEvaluacion = null; // Asegurarse de limpiar los datos previos

    if (tipo === 'editar' && evaluacion) {
      this.evaluacionSeleccionada = evaluacion; // Asignar la evaluación seleccionada
      this.evaluacion = evaluacion;  // Asegúrate de que la evaluación también se asigna aquí
      console.log('Evaluación seleccionada para editar:', evaluacion);  // Verifica que se pasa correctamente
    }

    else if (tipo === 'crear') {
      try {
        // Usar el servicio para obtener la última evaluación
        const ultimaEvaluacion = await this.evaluacionService.getUltimaEvaluacionByPaciente(this.pacienteId).toPromise();

        if (ultimaEvaluacion) {
          // Mostrar un modal o confirmación para preguntar si se desean usar los datos anteriores
          const usarDatosAnteriores = confirm("¿Deseas usar los datos de la última evaluación?");
          this.ultimaEvaluacion = usarDatosAnteriores ? ultimaEvaluacion : null;
        }
      } catch (error) {
        console.error("Error al obtener la última evaluación", error);
        this.ultimaEvaluacion = null;
      }
    }

    // Abrir el modal independientemente de si se usan datos anteriores o no
    this.mostrarModal = true;
  }



  // Cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  manejarEvaluacion(evaluacion: Evaluacion): void {
    this.getLastEvaluacion(); // Actualizar la última evaluación
    this.cerrarModal(); // Cerrar el modal
  }

  // Obtener las evaluaciones pasadas del paciente
  verEvaluacionesPasadas(): void {
    this.evaluacionService.getEvaluacionesByPaciente(this.pacienteId).subscribe(
      (data) => {
        this.evaluacionesPasadas = data;
      },
      (error) => {
        console.error('Error al obtener evaluaciones pasadas:', error);
      }
    );
  }

  // Guardar la evaluación (crear o editar)
  guardarEvaluacion(evaluacion: Evaluacion): void {
    if (this.modalTipo === 'crear') {
      // Lógica para crear
      this.evaluacionService.createEvaluacion(evaluacion).subscribe({
        next: () => {
          console.log('Evaluación creada con éxito');
          this.getLastEvaluacion();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear evaluación:', err),
      });
    } else if (this.modalTipo === 'editar') {
      // Lógica para editar
      if (!evaluacion.evaluacion_id) {
        console.error('El ID de la evaluación no está definido.');
        return;
      }

      console.log('Actualizar evaluación:', evaluacion);

      this.evaluacionService.updateEvaluacion(evaluacion.evaluacion_id, evaluacion).subscribe({
        next: (updatedEvaluacion) => {
          console.log('Evaluación actualizada:', updatedEvaluacion);
          // Aquí puedes actualizar la lista de evaluaciones o mostrar un mensaje de éxito
          this.getLastEvaluacion();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar la evaluación:', error);
        }
      });
    }
  }
}
