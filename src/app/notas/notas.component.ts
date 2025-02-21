import { Component, Input, OnInit } from '@angular/core';
import { Nota } from '../models/notas.model';
import { NotaService } from '../services/notas.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CrearNotaComponent } from '../crear-nota/crear-nota.component';

@Component({
  selector: 'app-notas',
  imports: [CommonModule, CrearNotaComponent],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css'
})
export class NotasComponent implements OnInit {
  @Input() pacienteId!: number;
  notas: Nota[] = [];
  mostrarModal = false;
  notaEnEdicion: Nota | null = null;

  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.pacienteId) {
      this.cargarNotas(this.pacienteId);
    }
  }

  cargarNotas(pacienteId: number): void {
    this.notaService.getNotasByPaciente(pacienteId).subscribe(
      (notas) => (this.notas = notas.reverse()),
      (error) => console.error('Error al cargar las notas:', error)
    );
  }

  abrirModal(nota: Nota | null = null): void {
    if (nota && nota.nota_id) {
      this.notaService.getNotaById(nota.nota_id).subscribe({
        next: (notaCompleta: Nota) => {
          this.notaEnEdicion = notaCompleta;
          this.mostrarModal = true;
        },
        error: (error: any) => console.error('Error al cargar la nota:', error),
      });
    } else {
      this.notaEnEdicion = null; // Crear una nueva nota
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.notaEnEdicion = null;
    this.mostrarModal = false;
  }

  manejarNotaGuardada(): void {
    this.cerrarModal();
    this.cargarNotas(this.pacienteId);
  }
}

