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

  obtenerSesionesPorPaciente(pacienteId: number): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${this.baseUrl}/paciente/${pacienteId}`);
  }

}

