import { Component } from '@angular/core';
import { Bono } from '../models/bono.model';
import { BonoService } from '../services/bono.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-bono',
  imports: [CommonModule],
  templateUrl: './lista-bono.component.html',
  styleUrl: './lista-bono.component.css'
})
export class ListaBonoComponent {
  bonos: Bono[] = [];
  mesActual: number;
  anioActual: number;
  totalBonos: number = 0;
  cantidadBonos: number = 0;

  constructor(private bonoService: BonoService) {
    const hoy = new Date();
    this.mesActual = hoy.getMonth() + 1;
    this.anioActual = hoy.getFullYear();
  }

  ngOnInit(): void {
    this.cargarBonos();
  }

  obtenerNombreMes(mes: number): string {
    const nombresMes = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return nombresMes[mes - 1] || '';
  }

  cargarBonos(): void {
    this.bonoService.getBonosPorMes(this.mesActual, this.anioActual).subscribe({
      next: (data) => {
        this.bonos = data;
        this.totalBonos = data.reduce((sum, b) => sum + b.valor, 0);
        this.cantidadBonos = data.length;
      },
      error: (error) => {
        console.error('Error al obtener bonos:', error);
      }
    });
  }

  formatearValor(valor: number): string {
    return valor.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    });
  }
}

