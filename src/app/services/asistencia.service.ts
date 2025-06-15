import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/asistencia`;

  constructor(private http: HttpClient) { }

  create(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  actualizarEstadoAsistencia(pacienteId: number, fecha: string, hora: string, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}`, {
      pacienteId,
      fecha,
      hora,
      estado
    });
  }

  // Generar asistencias para la semana desde una fecha inicio (string)
  generarAsistenciasGlobal(fechaInicio: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar-semana`, { inicio: fechaInicio });
  }

  // Obtener asistencias de un paciente en un rango de fechas
  findByPacienteAndRango(pacienteId: number, inicio: string, fin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${pacienteId}?inicio=${inicio}&fin=${fin}`);
  }

  getAsistenciasRango(inicio: string, fin: string) {
    return this.http.get<any[]>(`${this.apiUrl}/rango?inicio=${inicio}&fin=${fin}`);
  }

}

