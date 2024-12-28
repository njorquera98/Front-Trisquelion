import { Component, EventEmitter, Output } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { ActivatedRoute } from '@angular/router';
import { Sesion } from '../models/sesion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-sesion.component.html',
  styleUrl: './crear-sesion.component.css'
})
export class CrearSesionComponent {
  pacienteId: number = 0;
  tipo_sesion: string = '';
  n_folio: string = '';
  fecha: string = '';
  hora: string = '';
  descripcion: string = '';

  @Output() sesionCreada: EventEmitter<void> = new EventEmitter<void>(); // Evento para notificar que la sesión se guardó

  constructor(
    private sesionService: SesionService,
    private route: ActivatedRoute
  ) {
    // Obtener el pacienteId desde la URL
    this.route.params.subscribe(params => {
      this.pacienteId = +params['id'];
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    const sesionData: Sesion = {
      fecha: new Date(this.fecha),
      hora: this.hora,
      descripcion: this.descripcion,
      tipo_sesion: this.tipo_sesion,
      paciente_fk: this.pacienteId,
    };

    // Llamar al servicio para crear la sesión
    this.sesionService.createSesion(this.pacienteId, sesionData).subscribe(
      (response: Sesion) => {  // Especificar el tipo
        this.sesionCreada.emit();  // Emitir el Evento
      },
      (error: any) => {  // Aquí el tipo `any` es aceptable si no sabes qué tipo de error recibirás
        console.error('Error al crear la sesión:', error);
      }
    );

  }
}
