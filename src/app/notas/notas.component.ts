import { Component, Input, OnInit } from '@angular/core';
import { Nota } from '../models/notas.model';
import { NotaService } from '../services/notas.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notas',
  imports: [CommonModule],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css'
})
export class NotasComponent implements OnInit {
  pacienteId!: number;
  notas: Nota[] = [];

  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService
  ) { }

  ngOnInit(): void {
    // Obtener el pacienteId desde la URL de la ruta activa
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.obtenerNotas();
    } else {
      console.error('pacienteId no encontrado');
    }
  }

  obtenerNotas(): void {
    this.notaService.getNotas(this.pacienteId).subscribe(
      (data) => {
        this.notas = data.reverse();
      },
      (error) => {
        console.error('Error al cargar las notas:', error);
      }
    );
  }

  abrirModalNota(): void {
    console.log("Abrir modal de notas");
    // Lógica para abrir el modal
  }
}
