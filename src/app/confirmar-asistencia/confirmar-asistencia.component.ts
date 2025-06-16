import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmar-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmar-asistencia.component.html',
  styleUrl: './confirmar-asistencia.component.css'
})
export class ConfirmarAsistenciaComponent {
  @Input() visible = false;
  @Input() nombrePaciente = '';
  @Input() horarioSeleccionado: any;

  @Output() cerrar = new EventEmitter<void>();
  @Output() reprogramar = new EventEmitter<{ fecha: string; hora: string }>();
  @Output() actualizarEstado = new EventEmitter<string>();

  mostrarModalReprogramar = false;
  fechaReprogramada = '';
  horaReprogramada = '';

  abrirReprogramacion() {
    this.mostrarModalReprogramar = true;
  }

  emitirEstado(estado: string) {
    this.actualizarEstado.emit(estado);
    this.cerrar.emit();
  }

  confirmarReprogramacion() {
    if (this.fechaReprogramada && this.horaReprogramada) {
      // Emito la reprogramación con fecha y hora al componente padre
      this.reprogramar.emit({ fecha: this.fechaReprogramada, hora: this.horaReprogramada });
      this.mostrarModalReprogramar = false;
      this.cerrar.emit();
    }
  }

  cancelarReprogramacion() {
    this.mostrarModalReprogramar = false;
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}

