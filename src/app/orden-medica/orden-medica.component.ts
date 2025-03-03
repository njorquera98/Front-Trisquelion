import { Component } from '@angular/core';
import { DocumentoService } from '../services/documento.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Documento } from '../models/documento.model';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-orden-medica',
  imports: [CommonModule],
  templateUrl: './orden-medica.component.html',
  styleUrl: './orden-medica.component.css'
})
export class OrdenMedicaComponent {
  documentos: Documento[] = [];
  pacienteId!: number;

  constructor(
    private documentoService: DocumentoService,
    private emailService: EmailService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerDocumentos();
    console.log(this.documentos);

  }

  obtenerDocumentos(): void {
    console.log(this.pacienteId);

    this.documentoService.obtenerDocumentosPorPaciente(this.pacienteId)
      .subscribe((documentos) => {
        this.documentos = documentos.reverse();
        console.log(this.documentos);

      });

  }

  descargarPDF(codigo_validacion: string): void {
    console.log(`Descargando PDF con código de validación: ${codigo_validacion}`);

    // Llamar al servicio para obtener el archivo PDF
    this.documentoService.obtenerPDF(codigo_validacion).subscribe(
      (blob) => {
        // Crear un enlace temporal para la descarga y simular el clic
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documento_${codigo_validacion}.pdf`; // Nombre del archivo descargado
        a.click();
        window.URL.revokeObjectURL(url); // Revocar la URL para liberar recursos
      },
      (error) => {
        console.error('Error al descargar el PDF:', error);
      }
    );
  }

  enviarCorreo(codigoValidacion: string): void {
    console.log(`Enviando correo con código de validación: ${codigoValidacion}`);

    this.emailService.enviarDocumento(codigoValidacion).subscribe(
      (response) => {
        alert('Correo enviado exitosamente');
      },
      (error) => {
        console.error('Error al enviar el correo', error);
        alert('Error al enviar el correo');
      }
    );
  }
}
