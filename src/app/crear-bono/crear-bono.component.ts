import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BonoService } from '../services/bono.service'; // Asegúrate de tener este servicio
import { Bono } from '../models/bono.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-bono',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-bono.component.html',
  styleUrl: './crear-bono.component.css'
})
export class CrearBonoComponent implements OnInit {
  pacienteId: number = 0;
  cantidad: number = 0;
  valor: number = 0;
  folio: string = '';
  sesionesDisponibles: number = 0;

  @Input() bono: Bono | null = null; // Bono a editar (si es null, se crea uno nuevo)
  @Output() bonoCreado: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    // Obtener el pacienteId desde la URL
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
    });
  }

  ngOnInit(): void {
    // Si se pasa un bono por @Input, prellenar los campos con sus datos
    if (this.bono) {
      this.cantidad = this.bono.cantidad;
      this.valor = this.bono.valor;
      this.folio = this.bono.folio;
      this.sesionesDisponibles = this.bono.sesionesDisponibles;
    }
  }

  onSubmit(): void {
    if (this.bono) {
      const bonoData: Bono = {
        ...this.bono,
        paciente_fk: this.pacienteId,
        cantidad: this.cantidad,
        valor: this.valor,
        folio: this.folio,
        sesionesDisponibles: this.sesionesDisponibles,
      };

      // Verificar que bono_id no sea undefined antes de llamar a updateBono
      if (bonoData.bono_id !== undefined) {
        this.bonoService.updateBono(bonoData.bono_id, bonoData).subscribe(
          (response: Bono) => {
            console.log('Bono actualizado:', response);
            this.bonoCreado.emit(); // Emitir evento para actualizar la lista
          },
          (error) => {
            console.error('Error al actualizar el bono:', error);
          }
        );
      } else {
        console.error('Error: bono_id es undefined. No se puede actualizar el bono.');
      }
    } else {
      // Lógica para crear un nuevo bono
      const nuevoBono: Bono = {
        bono_id: 0,
        paciente_fk: this.pacienteId,
        cantidad: this.cantidad,
        valor: this.valor,
        folio: this.folio,
        sesionesDisponibles: this.cantidad,
      };

      this.bonoService.createBono(nuevoBono).subscribe(
        (response: Bono) => {
          console.log('Bono creado:', response);
          this.bonoCreado.emit(); // Emitir evento para actualizar la lista
        },
        (error) => {
          console.error('Error al crear bono:', error);
        }
      );
    }
  }

}
