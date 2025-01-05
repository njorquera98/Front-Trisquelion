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
import { BonosComponent } from '../bonos/bonos.component';
import { CrearPacienteComponent } from '../crear-paciente/crear-paciente.component';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, TabsComponent, SesionesComponent, ConsultasMedicasComponent, EvaluacionComponent, PatologiasComponent, BonosComponent, CrearPacienteComponent], // Importa tus componentes aquí
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  pacienteId: number = 0;
  paciente: Paciente | null = null;
  mostrarModal: boolean = false;
  vistaSeleccionada: string = 'sesiones'; // Vista por defecto
  modo: 'crear' | 'editar' = 'crear';

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
  ) { }

  ngOnInit(): void {
    const pacienteIdParam = this.route.snapshot.paramMap.get('id');
    this.pacienteId = pacienteIdParam ? Number(pacienteIdParam) : 0;

    if (this.pacienteId) {
      this.cargarPaciente(this.pacienteId);
    }
  }

  cargarPaciente(pacienteId: number): void {
    this.pacienteService.getPaciente(pacienteId).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
      },
      error: (error) => {
        console.error('Error al cargar el paciente:', error);
      },
    });
  }

  cambiarVista(vista: string): void {
    this.vistaSeleccionada = vista;
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarPaciente(paciente: Paciente): void {
    if (this.pacienteId) {
      this.pacienteService.updatePaciente(this.pacienteId, paciente).subscribe({
        next: (pacienteActualizado) => {
          console.log('Paciente actualizado:', pacienteActualizado);
          this.paciente = pacienteActualizado;
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar el paciente:', error);
        },
      });
    } else {
      console.error('No hay un ID de paciente para actualizar.');
    }
  }


  onPacienteActualizado(pacienteActualizado: Paciente): void {
    console.log('Paciente actualizado desde el modal:', pacienteActualizado);
    this.guardarPaciente(pacienteActualizado);
  }
}
