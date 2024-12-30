import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from '../models/paciente.model';

@Component({
  selector: 'app-consultas-medicas',
  imports: [CommonModule],
  templateUrl: './consultas-medicas.component.html',
  styleUrl: './consultas-medicas.component.css'
})
export class ConsultasMedicasComponent {
  @Input() pacienteId!: number;
  paciente: Paciente | null = null;


  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.cargarPaciente(this.pacienteId);
    }

  }

  cargarPaciente(pacienteId: number): void {
    this.pacienteService.getPaciente(pacienteId).subscribe(
      (paciente) => {
        this.paciente = paciente;
      },
      (error) => {
        console.error('Error al cargar el paciente:', error);
      }
    );
  }
}


