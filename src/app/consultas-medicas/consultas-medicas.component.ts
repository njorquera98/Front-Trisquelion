import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Consulta } from '../models/consultas-medicas.model';
import { ConsultaService } from '../services/consultas-medicas.service';
import { CrearConsultasComponent } from '../crear-consultas/crear-consultas.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentoService } from '../services/documento.service';

@Component({
  selector: 'app-consultas-medicas',
  imports: [CommonModule, FormsModule, CrearConsultasComponent],
  templateUrl: './consultas-medicas.component.html',
  styleUrl: './consultas-medicas.component.css'
})
export class ConsultasMedicasComponent implements OnInit {
  @Input() pacienteId!: number;
  consultas: Consulta[] = []; // Lista de consultas del paciente
  isLoading = true;

  consultaEnEdicion: Consulta | null = null; // Guarda la consulta en edición
  editandoConsulta = false; // Booleano para saber si se está editando

  mostrarModal = false;
  consultaSeleccionada: Consulta | null = null;

  constructor(
    private consultaService: ConsultaService,
    private documentoService: DocumentoService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Paciente ID obtenido en ngOnInit:', this.pacienteId);

    if (this.pacienteId) {
      this.fetchConsultas();
    }
  }

  // Obtener las consultas del paciente
  fetchConsultas(): void {
    this.consultaService.getConsultasByPaciente(this.pacienteId).subscribe(
      (data) => {
        this.consultas = data.reverse();
        this.isLoading = false;
        console.log('Consultas cargadas:', data);
      },
      (error) => {
        console.error('Error al obtener las consultas', error);
        this.isLoading = false;
      }
    );
  }

  // Abrir el modal para crear o editar una consulta
  abrirModal(consulta: Consulta | null = null): void {
    this.consultaSeleccionada = consulta ? { ...consulta } : null; // Clonar la consulta si se edita
    this.consultaEnEdicion = consulta; // Guardar la consulta en edición
    this.editandoConsulta = !!consulta; // Booleano para saber si es edición
    this.mostrarModal = true;
  }

  // Guardar o actualizar una consulta
  guardarConsulta(consulta: Consulta): void {
    consulta.paciente_fk = this.pacienteId; // Asociar la consulta al paciente
    console.log('Consulta a guardar:', consulta);

    if (this.editandoConsulta && consulta.consulta_id !== undefined) {
      this.consultaService.updateConsulta(consulta.consulta_id, consulta).subscribe(() => {
        this.fetchConsultas();
        this.cerrarModal();
      });
    } else {
      this.consultaService.createConsulta(consulta).subscribe(() => {
        this.fetchConsultas();
        this.cerrarModal();
      });
    }
  }

  // Recargar la lista después de agregar una consulta
  manejarConsultaCreada(): void {
    this.fetchConsultas();
    this.cerrarModal();
  }

  // Cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false;
    this.consultaEnEdicion = null;
    this.editandoConsulta = false;
  }
  getMedicoNombre(consulta: Consulta): string {
    if (typeof consulta.medico === 'object' && consulta.medico !== null) {
      return `${consulta.medico.nombre} ${consulta.medico.apellido}`;
    }
    return 'No registrado';
  }

  generarDocumento(consulta_id: number | undefined): void {
    if (consulta_id !== undefined) {
      this.documentoService.crearDocumento(consulta_id).subscribe(
        (response) => {
          console.log('Documento creado con éxito:', response);
        },
        (error) => {
          console.error('Error al crear documento:', error);
        }
      );
      console.log('Consulta seleccionada con ID:', consulta_id);
    } else {
      console.error('Error: ID de consulta no está definido');
    }
  }

}

