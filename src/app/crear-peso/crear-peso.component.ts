import { PesoMaximoService } from '../services/peso-maximo.service';
import { PesoMaximo } from '../models/peso-maximo.model';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-peso',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-peso.component.html',
  styleUrl: './crear-peso.component.css'
})
export class CrearPesoComponent implements OnInit {
  @Input() pacienteId!: number;
  @Input() peso: PesoMaximo | null = null; // Peso para edición
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo de operación: crear o editar
  @Output() pesoGuardado = new EventEmitter<void>(); // Evento para notificar guardado
  @Output() cerrarModal = new EventEmitter<void>(); // Evento para cerrar modal

  ejercicio: string = ''; // Variable para ejercicio
  pesoMaximo: number = 0; // Variable para peso máximo

  constructor(private pesoService: PesoMaximoService) { }

  ngOnInit(): void {
    console.log('ngOnInit - modo:', this.modo);
    if (this.modo === 'editar' && this.peso) {
      this.cargarDatosPeso();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges - cambios:', changes);
    if (changes['peso'] && changes['peso'].currentValue) {
      this.cargarDatosPeso();
    }
  }

  cargarDatosPeso(): void {
    if (this.peso) {
      console.log('cargarDatosPeso - cargando datos:', this.peso);
      this.ejercicio = this.peso.ejercicio || '';
      this.pesoMaximo = this.peso.peso || 0;
    }
  }

  onSubmit(): void {
    // Verificar que 'pesoMaximo' y 'pacienteId' no sean 0 o undefined antes de enviar el objeto
    if (this.pesoMaximo === 0 || !this.pacienteId) {
      alert('El peso y el paciente son necesarios.');
      return; // No continuar si no están definidos
    }

    const nuevoPeso: PesoMaximo = {
      paciente_fk: this.pacienteId, // Asegurarse que 'pacienteId' sea válido
      ejercicio: this.ejercicio,
      peso: this.pesoMaximo,
      fechaRegistro: new Date().toISOString() // Asignando la fecha actual
    };

    console.log('onSubmit - nuevoPeso:', nuevoPeso);

    if (this.modo === 'editar' && this.peso && this.peso.peso_id) {
      this.pesoService.updatePeso(this.peso.peso_id, nuevoPeso).subscribe(() => {
        console.log('onSubmit - Peso actualizado con éxito');
        this.pesoGuardado.emit();
      });
    } else {
      this.pesoService.addPeso(nuevoPeso).subscribe(() => {
        console.log('onSubmit - Nuevo peso guardado con éxito');
        this.pesoGuardado.emit();
      });
    }
  }

  cerrarModalFunc(): void {
    this.cerrarModal.emit();
  }
}
