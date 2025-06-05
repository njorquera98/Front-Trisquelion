import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmar-asistencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmar-asistencia.component.html',
  styleUrl: './confirmar-asistencia.component.css'
})
export class ConfirmarAsistenciaComponent {
  @Input() visible = false;
  @Input() nombrePaciente = '';
  @Output() cerrar = new EventEmitter<void>();
  @Output() respuesta = new EventEmitter<'si' | 'no' | 'suspende'>();
  @Output() reprogramar = new EventEmitter<{ fecha: string; hora: string }>();

  mostrarModalReprogramar = false;
  fechaReprogramada = '';
  horaReprogramada = '';

  emitirRespuesta(valor: 'si' | 'no' | 'suspende' | 'reprogramar') {
    if (valor === 'reprogramar') {
      this.mostrarModalReprogramar = true;
      return;
    }
    this.respuesta.emit(valor);
    this.cerrar.emit();
  }

  confirmarReprogramacion() {
    if (this.fechaReprogramada && this.horaReprogramada) {
      this.reprogramar.emit({
        fecha: this.fechaReprogramada,
        hora: this.horaReprogramada,
      });
      this.mostrarModalReprogramar = false;
      this.cerrar.emit();
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  cancelarReprogramacion() {
    this.mostrarModalReprogramar = false;
  }
}

