import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../models/sesion.model';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private baseUrl = 'http://localhost:3000/sesiones'; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) { }

  getSesionesConFolio(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/paciente/${pacienteId}`);
  }

  getLastSesion(pacienteId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.baseUrl}/last/${pacienteId}`);
  }

  createSesion(sesionData: Sesion): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.baseUrl}`, sesionData);
  }

  getSesionById(sesionId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.baseUrl}/${sesionId}`);
  }

  getSesionSimple(sesionId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.baseUrl}/simple/${sesionId}`);
  }

  updateSesion(id: number, sesion: Partial<Sesion>): Observable<Sesion> {
    return this.http.patch<Sesion>(`${this.baseUrl}/${id}`, sesion);

  }
}

