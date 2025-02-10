import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Horario } from '../models/horario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${environment.apiUrl}/horario`;

  constructor(private http: HttpClient) { }
  // Obtener horarios de un paciente
  obtenerHorarios(pacienteId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Método para obtener los horarios de hoy
  obtenerHorariosDeHoy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // Agregar un horario
  agregarHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  // Actualizar un horario
  actualizarHorario(horarioId: number, horario: Partial<Horario>): Observable<Horario> {
    return this.http.patch<Horario>(`${this.apiUrl}/${horarioId}`, horario);
  }

  // Eliminar un horario
  eliminarHorario(horarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${horarioId}`);
  }
}


