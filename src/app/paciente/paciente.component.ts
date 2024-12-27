import { Component, OnInit } from '@angular/core';
import { Paciente } from '../models/paciente.model';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { SesionesComponent } from '../sesiones/sesiones.component';
import { ConsultasMedicasComponent } from '../consultas-medicas/consultas-medicas.component';
import { EvaluacionComponent } from '../evaluacion/evaluacion.component';
import { PatologiasComponent } from '../patologias/patologias.component';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, TabsComponent, SesionesComponent, ConsultasMedicasComponent, EvaluacionComponent, PatologiasComponent], // Importa tus componentes aquí
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  pacienteId: number = 0;
  paciente: Paciente | null = null;

  // Controla la vista actual
  vistaSeleccionada: string = 'sesiones';

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

  // Cambiar la vista según el evento emitido por el componente Tabs
  cambiarVista(vista: string): void {
    this.vistaSeleccionada = vista;
  }
}

