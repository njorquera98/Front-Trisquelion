import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Consulta } from '../models/consultas-medicas.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-consultas',
  imports: [FormsModule],
  templateUrl: './crear-consultas.component.html',
  styleUrl: './crear-consultas.component.css'
})
export class CrearConsultasComponent {
  @Input() consulta: Consulta | null = null;
  @Output() consultaGuardada = new EventEmitter<Consulta>();
  @Output() modalCerrado = new EventEmitter<void>();

  nuevaConsulta: Consulta = { fecha: '', hora: '', tipoConsulta: '', motivo: '', sintomas: '', paciente_fk: 0 };


  ngOnInit(): void {
    console.log('Consulta recibida en modal:', this.consulta);
    if (this.consulta) {
      this.nuevaConsulta = { ...this.consulta };
    }
  }

  guardar(): void {
    this.consultaGuardada.emit(this.nuevaConsulta);
  }

  cerrar(): void {
    this.modalCerrado.emit();
  }
}

