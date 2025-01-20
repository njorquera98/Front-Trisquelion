import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../models/sesion.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private apiUrl = `${environment.apiUrl}/sesiones`;

  constructor(private http: HttpClient) { }

  // Obtener las sesiones de un paciente, usando su ID
  getSesionesConFolio(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Obtener la última sesión de un paciente
  getLastSesion(pacienteId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.apiUrl}/last/${pacienteId}`);
  }

  // Crear una nueva sesión
  createSesion(sesionData: Sesion): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.apiUrl}`, sesionData);
  }

  // Obtener una sesión por su ID
  getSesionById(sesionId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.apiUrl}/${sesionId}`);
  }

  // Obtener una versión simplificada de una sesión por su ID
  getSesionSimple(sesionId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.apiUrl}/simple/${sesionId}`);
  }

  // Actualizar una sesión por su ID
  updateSesion(id: number, sesion: Partial<Sesion>): Observable<Sesion> {
    return this.http.patch<Sesion>(`${this.apiUrl}/${id}`, sesion);
  }
}

