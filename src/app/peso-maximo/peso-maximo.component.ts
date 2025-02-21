import { Component, Input, OnInit } from '@angular/core';
import { PesoMaximo } from '../models/peso-maximo.model';
import { PesoMaximoService } from '../services/peso-maximo.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CrearPesoComponent } from '../crear-peso/crear-peso.component';

@Component({
  selector: 'app-peso-maximo',
  imports: [CommonModule, CrearPesoComponent],
  templateUrl: './peso-maximo.component.html',
  styleUrl: './peso-maximo.component.css'
})
export class PesoMaximoComponent implements OnInit {
  @Input() pacienteId!: number;
  pesos: PesoMaximo[] = [];
  mostrarModal = false;
  pesoEnEdicion: PesoMaximo | null = null;

  constructor(private pesoService: PesoMaximoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.pacienteId) {
      this.cargarPesos(this.pacienteId);
    }
  }

  cargarPesos(pacienteId: number): void {
    this.pesoService.getPesosByPaciente(pacienteId).subscribe(
      (pesos) => (this.pesos = pesos.reverse()),
      (error) => console.error('Error al cargar los pesos:', error)
    );
  }

  abrirModal(peso: PesoMaximo | null = null): void {
    this.pesoEnEdicion = peso;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.pesoEnEdicion = null;
    this.mostrarModal = false;
  }

  manejarPesoGuardado(): void {
    this.cerrarModal();
    this.cargarPesos(this.pacienteId);
  }
}

