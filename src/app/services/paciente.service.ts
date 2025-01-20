import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiUrl}/pacientes`;

  constructor(private http: HttpClient) { }

  // Obtener pacientes activos
  getPacientesActivos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/activos`);
  }

  // Obtener pacientes inactivos
  getPacientesInactivos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/inactivos`);
  }

  // Obtener un paciente por su ID
  getPaciente(pacienteId: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${pacienteId}`);
  }

  // Crear un nuevo paciente
  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  // Actualizar la información de un paciente
  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.patch<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }
  // Actualizar estado de un paciente
  updatePacienteEstado(pacienteId: number, estado: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${pacienteId}`, { activo: estado });
  }
}

