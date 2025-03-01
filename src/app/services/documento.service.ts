import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/documento`;

  constructor(private http: HttpClient) { }

  // Obtener docuymentos de un paciente
  obtenerDocumentosPorPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Método para descargar el PDF desde el backend usando la URL correcta
  obtenerPDF(codigoValidacion: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${codigoValidacion}`, {
      responseType: 'blob'
    });
  }

  //Crear un documento asociado a una consulta
  crearDocumento(consultaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear/${consultaId}`, {});
  }
}



