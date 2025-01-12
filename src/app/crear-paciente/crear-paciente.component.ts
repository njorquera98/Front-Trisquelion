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
  @Input() paciente: Paciente | null = null; // Paciente que se editará (si está en modo editar)
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo de operación
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
    if (changes['paciente'] && changes['paciente'].currentValue && this.modo === 'editar') {
      // Si hay un paciente y estamos en modo edición, cargamos los datos
      this.cargarDatosPaciente(changes['paciente'].currentValue);
    } else if (this.modo === 'crear') {
      // Si estamos en modo crear, reiniciamos el formulario
      this.reiniciarFormulario();
    }
  }

  cargarDatosPaciente(paciente: Paciente): void {
    // Rellenamos el formulario con los datos del paciente a editar
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

  reiniciarFormulario(): void {
    // Reiniciamos el formulario para la creación de un nuevo paciente
    this.formulario = {
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
  }

  onSubmit(): void {
    // Creamos un objeto de paciente con los datos del formulario
    const paciente: Paciente = {
      ...this.formulario,
      paciente_id: this.paciente?.paciente_id || 0, // Si no existe paciente_id, es un nuevo paciente
      fecha_nacimiento: new Date(this.formulario.fechaNacimiento),
    };

    // Emitimos el evento para guardar el paciente (ya sea nuevo o editado)
    this.pacienteGuardado.emit(paciente);
  }

  cerrarModalFunc(): void {
    // Emitimos el evento para cerrar el modal
    this.cerrarModal.emit();
  }
}

