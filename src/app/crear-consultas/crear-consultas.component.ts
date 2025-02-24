import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Consulta } from '../models/consultas-medicas.model';
import { FormsModule } from '@angular/forms';
import { Medico } from '../models/medico.model';
import { MedicoService } from '../services/medico.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-consultas',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-consultas.component.html',
  styleUrl: './crear-consultas.component.css'
})
export class CrearConsultasComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Output() consultaGuardada = new EventEmitter<Consulta>();
  @Output() modalCerrado = new EventEmitter<void>();

  nuevaConsulta: Consulta = {
    fecha: '',
    hora: '',
    tipoConsulta: '',
    motivo: '',
    sintomas: '',
    diagnostico: '',
    paciente_fk: 0,
    medico: 0 // Se guarda como un número (ID del médico)
  };
  medicos: Medico[] = [];

  constructor(private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.obtenerMedicos();
    console.log('Consulta recibida en modal:', this.consulta);
    if (this.consulta) {
      // Si la consulta ya existe, solo asigna el ID del médico
      this.nuevaConsulta = {
        ...this.consulta,
        medico: this.consulta.medico ? (this.consulta.medico as { medico_id: number }).medico_id : 0 // Asegura que solo se guarda el ID del médico
      };
    }
  }

  obtenerMedicos(): void {
    this.medicoService.getMedicos().subscribe((data) => {
      this.medicos = data;
    });
  }

  guardar(): void {
    // Antes de guardar, asegura que el médico es solo un número (ID)
    if (typeof this.nuevaConsulta.medico !== 'number') {
      this.nuevaConsulta.medico = this.nuevaConsulta.medico.medico_id;
    }

    // Emite la consulta con el ID del médico
    this.consultaGuardada.emit(this.nuevaConsulta);
  }

  cerrar(): void {
    this.modalCerrado.emit();
  }
}
