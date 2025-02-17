import { Component, Input, OnInit } from '@angular/core';
import { PesoMaximo } from '../models/peso-maximo.model';
import { PesoMaximoService } from '../services/peso-maximo.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-peso-maximo',
  imports: [CommonModule],
  templateUrl: './peso-maximo.component.html',
  styleUrl: './peso-maximo.component.css'
})
export class PesoMaximoComponent implements OnInit {
  pacienteId!: number; // No es necesario @Input, ya que lo obtendremos de la ruta
  pesosMaximos: PesoMaximo[] = [];

  constructor(
    private route: ActivatedRoute,
    private pesoMaximoService: PesoMaximoService
  ) { }

  ngOnInit(): void {
    // Obtener el pacienteId desde la URL de la ruta activa
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.obtenerPesosMaximos();
    } else {
      console.error('pacienteId no encontrado');
    }
  }

  obtenerPesosMaximos(): void {
    this.pesoMaximoService.getPesos(this.pacienteId).subscribe(
      (data) => {
        this.pesosMaximos = data;
      },
      (error) => {
        console.error('Error al cargar los pesos máximos:', error);
      }
    );
  }

  abrirModalPeso() {
    console.log("Abrir modal de pesos máximos");
    // Lógica para abrir el modal
  }
}
