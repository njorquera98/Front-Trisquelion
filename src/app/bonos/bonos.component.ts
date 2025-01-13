import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BonoService } from '../services/bono.service';
import { Bono } from '../models/bono.model';
import { CommonModule } from '@angular/common';
import { CrearBonoComponent } from '../crear-bono/crear-bono.component';

@Component({
  selector: 'app-bonos',
  imports: [CommonModule, CrearBonoComponent],
  templateUrl: './bonos.component.html',
  styleUrl: './bonos.component.css'
})
export class BonosComponent implements OnInit {
  @Input() pacienteId!: number;
  bonos: Bono[] = [];
  mostrarModal = false;
  bonoEnEdicion: Bono | null = null;

  constructor(
    private route: ActivatedRoute,
    private bonoService: BonoService,
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.cargarBonos(this.pacienteId);
    }
  }

  cargarBonos(pacienteId: number): void {
    this.bonoService.getFoliosByPaciente(pacienteId).subscribe(
      (bonos) => {
        if (bonos) {
          this.bonos = bonos.reverse(); // Opcional: invertir el array para mostrar los últimos bonos primero
        }
      },
      (error) => {
        console.error('Error al cargar los bonos:', error);
      }
    );
  }

  abrirModal(bono: Bono | null = null): void {
    if (bono && bono.bono_id) {
      this.bonoService.getBonoById(bono.bono_id).subscribe({
        next: (bonoCompleto) => {
          this.bonoEnEdicion = bonoCompleto;
          this.mostrarModal = true;
        },
        error: (error) => console.error('Error al cargar el bono:', error),
      });
    } else {
      this.bonoEnEdicion = null; // Crear un nuevo bono
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.bonoEnEdicion = null;
    this.mostrarModal = false;
  }

  manejarBonoCreado() {
    this.cerrarModal();
    this.cargarBonos(this.pacienteId); // Recargar los bonos al crear uno nuevo
  }
}

