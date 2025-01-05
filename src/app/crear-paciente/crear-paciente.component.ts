import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Paciente } from '../models/paciente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-paciente',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-paciente.component.html',
  styleUrl: './crear-paciente.component.css'
})
export class CrearPacienteComponent {
  @Input() paciente: Paciente | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() pacienteGuardado = new EventEmitter<Paciente>();
  @Output() cerrarModal = new EventEmitter<void>();

  formulario = {
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    fechaNacimiento: '',
    prevision: '',
    domicilio: '',
    rut: '',
    activo: true,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paciente'] && changes['paciente'].currentValue) {
      this.cargarDatosPaciente(changes['paciente'].currentValue);
    }
  }

  cargarDatosPaciente(paciente: Paciente): void {
    this.formulario = {
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      telefono: paciente.telefono,
      correo: paciente.correo,
      fechaNacimiento: paciente.fecha_nacimiento
        ? new Date(paciente.fecha_nacimiento).toISOString().substring(0, 10)
        : '',
      prevision: paciente.prevision,
      domicilio: paciente.domicilio,
      rut: paciente.rut,
      activo: paciente.activo,
    };
  }



  onSubmit(): void {
    const paciente: Paciente = {
      ...this.formulario,
      paciente_id: this.paciente?.paciente_id || 0,
      fecha_nacimiento: new Date(this.formulario.fechaNacimiento),
    };
    this.pacienteGuardado.emit(paciente);
  }

  cerrarModalFunc(): void {
    this.cerrarModal.emit();
  }
}

