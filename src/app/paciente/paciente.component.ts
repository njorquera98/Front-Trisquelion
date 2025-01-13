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
import { AsistenciaComponent } from '../asistencia/asistencia.component';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, TabsComponent, SesionesComponent, ConsultasMedicasComponent, EvaluacionComponent, PatologiasComponent, BonosComponent, CrearPacienteComponent, AsistenciaComponent],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  pacienteId: number = 0; // ID del paciente, si está en modo edición
  pacienteSeleccionado: Paciente | null = null; // Paciente actual
  mostrarModal: boolean = false; // Estado del modal
  vistaSeleccionada: string = 'sesiones'; // Vista por defecto
  modo: 'crear' | 'editar' = 'crear'; // Modo del modal

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService
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
        this.pacienteSeleccionado = paciente;
      },
      error: (error) => {
        console.error('Error al cargar el paciente:', error);
      },
    });
  }

  abrirModal(modo: 'crear' | 'editar', paciente: Paciente | null = null): void {
    this.modo = modo;
    this.pacienteSeleccionado = modo === 'editar' ? paciente : null;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cargarPaciente(this.pacienteId);
  }

  guardarPaciente(paciente: Paciente): void {
    if (this.modo === 'crear') {
      this.pacienteService.createPaciente(paciente).subscribe({
        next: (nuevoPaciente) => {
          console.log('Paciente creado:', nuevoPaciente);
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al crear el paciente:', error);
        },
      });
    } else if (this.modo === 'editar' && this.pacienteId) {
      this.pacienteService.updatePaciente(this.pacienteId, paciente).subscribe({
        next: (pacienteActualizado) => {
          console.log('Paciente actualizado:', pacienteActualizado);
          this.cargarPaciente(this.pacienteId);
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar el paciente:', error);
        },
      });
    }
  }

  cambiarVista(vista: string): void {
    this.vistaSeleccionada = vista;
  }

  onPacienteGuardado(paciente: Paciente): void {
    this.guardarPaciente(paciente);
  }
}
