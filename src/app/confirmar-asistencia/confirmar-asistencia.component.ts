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
  @Output() respuesta = new EventEmitter<'si' | 'no' | 'reprogramar'>();

  emitirRespuesta(valor: 'si' | 'no' | 'reprogramar') {
    this.respuesta.emit(valor);
    this.cerrar.emit();
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
