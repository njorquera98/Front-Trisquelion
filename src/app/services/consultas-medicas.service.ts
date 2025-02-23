import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consulta } from '../models/consultas-medicas.model';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private apiUrl = `${environment.apiUrl}/consulta`; // Asegúrate de que la URL sea correcta

  constructor(private http: HttpClient) { }

  // Obtener consultas por paciente
  getConsultasByPaciente(pacienteId: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Obtener consulta por ID
  getConsultaById(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva consulta
  createConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl, consulta);
  }

  // Actualizar una consulta
  updateConsulta(id: number, consulta: Consulta): Observable<Consulta> {
    return this.http.patch<Consulta>(`${this.apiUrl}/${id}`, consulta);
  }

  // Eliminar una consulta
  deleteConsulta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

