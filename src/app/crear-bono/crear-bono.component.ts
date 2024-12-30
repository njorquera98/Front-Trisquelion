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
  styleUrls: ['./crear-bono.component.css']
})
export class CrearBonoComponent implements OnInit {
  pacienteId: number = 0;
  cantidad: number = 0;
  valor: number = 0;
  folio: string = '';
  sesionesDisponibles: number = 0;

  @Output() bonoCreado: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private bonoService: BonoService,
    private route: ActivatedRoute
  ) {
    // Obtener el pacienteId desde la URL
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];  // Asignar el pacienteId desde la URL
    });
  }

  ngOnInit(): void {
    // Verifica que pacienteId esté disponible
    console.log('pacienteId recibido en CrearBonoComponent:', this.pacienteId);
  }

  onSubmit(): void {
    if (this.pacienteId === 0) {
      console.error('El ID del paciente no está definido');
      return;
    }

    const nuevoBono: Bono = {
      bono_id: 0,
      paciente_fk: this.pacienteId,
      cantidad: this.cantidad,
      valor: this.valor,
      folio: this.folio,
      sesionesDisponibles: this.sesionesDisponibles
    };

    // Llamar al servicio para crear el bono
    this.bonoService.createBono(nuevoBono).subscribe(
      (response: Bono) => {
        console.log('Bono creado:', response);
        this.bonoCreado.emit();  // Emitir el evento
      },
      (error) => {
        console.error('Error al crear bono:', error);
      }
    );
  }
}
