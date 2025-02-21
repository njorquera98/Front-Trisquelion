import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nota } from '../models/notas.model';
import { NotaService } from '../services/notas.service';

@Component({
  selector: 'app-crear-nota',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-nota.component.html',
  styleUrl: './crear-nota.component.css'
})
export class CrearNotaComponent implements OnInit {
  @Input() pacienteId!: number;
  @Input() nota: Nota | null = null; // Nota para edición
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo de operación: crear o editar
  @Output() notaGuardada = new EventEmitter<void>(); // Evento para notificar guardado
  @Output() cerrarModal = new EventEmitter<void>(); // Evento para cerrar modal

  contenido: string = '';
  fecha: string = '';

  constructor(private notaService: NotaService) { }

  ngOnInit(): void {
    if (this.modo === 'editar' && this.nota) {
      console.log('Cargando datos de nota en OnInit:', this.nota);
      this.cargarDatosNota();
    } else {
      this.fecha = new Date().toISOString().split('T')[0]; // Fecha actual por defecto al crear
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nota'] && changes['nota'].currentValue) {
      console.log('Nota recibida en ngOnChanges:', changes['nota'].currentValue);
      this.cargarDatosNota();
    }
  }

  cargarDatosNota(): void {
    if (this.nota) {
      console.log('Nota cargada:', this.nota);
      this.contenido = this.nota.contenido || '';

      // Convertir la fecha a formato YYYY-MM-DD
      if (this.nota.fechaCreacion) {
        this.fecha = new Date(this.nota.fechaCreacion).toISOString().split('T')[0];
      } else {
        this.fecha = new Date().toISOString().split('T')[0]; // Fecha actual si no hay fecha
      }
    }
  }

  onSubmit(): void {
    console.log('onSubmit - contenido ingresado:', this.contenido);
    console.log('onSubmit - fecha ingresada:', this.fecha);

    const formattedFecha = new Date(this.fecha).toISOString().split('T')[0]; // 🔹 Convierte a string formato YYYY-MM-DD

    if (this.nota) {
      // Editar nota existente
      const notaEditada: Nota = {
        ...this.nota,
        contenido: this.contenido,
        fechaCreacion: formattedFecha // 🔹 Enviar como string en formato YYYY-MM-DD
      };

      console.log('onSubmit - nota editada:', notaEditada);

      if (notaEditada.nota_id !== undefined) {
        this.notaService.updateNota(notaEditada.nota_id, notaEditada).subscribe(
          () => {
            console.log('onSubmit - Nota actualizada con éxito');
            this.notaGuardada.emit();
          },
          (error) => console.error('Error al actualizar la nota:', error)
        );
      } else {
        console.error('Error: nota_id es undefined');
      }
    } else {
      // Crear nueva nota
      const nuevaNota: Nota = {
        paciente_fk: this.pacienteId,
        contenido: this.contenido,
        fechaCreacion: formattedFecha // 🔹 Enviar como string en formato YYYY-MM-DD
      };

      console.log('onSubmit - Creando nueva nota:', nuevaNota);

      this.notaService.addNota(nuevaNota).subscribe(
        () => {
          console.log('onSubmit - Nota creada con éxito');
          this.notaGuardada.emit();
        },
        (error) => console.error('Error al crear la nota:', error)
      );
    }
  }

  cerrarModalFunc(): void {
    this.cerrarModal.emit();
  }
}
