import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private baseUrl = 'http://localhost:3000/pacientes'; // Cambia esto con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Obtener pacientes activos
  getPacientesActivos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/activos`);
  }

  // Obtener pacientes inactivos
  getPacientesInactivos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/inactivos`);
  }

  getPaciente(pacienteId: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/${pacienteId}`);
  }

  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.baseUrl, paciente);
  }

  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.patch<Paciente>(`${this.baseUrl}/${id}`, paciente);
  }
}

