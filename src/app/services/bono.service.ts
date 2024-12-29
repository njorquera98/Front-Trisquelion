import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bono } from '../models//bono.model';
@Injectable({
  providedIn: 'root',
})
export class BonoService {
  private apiUrl = 'http://localhost:3000/bonos'; // Asegúrate de que esta sea la URL correcta

  constructor(private http: HttpClient) { }

  // Obtener los folios de los bonos de un paciente
  getFoliosByPaciente(pacienteId: number): Observable<Bono[]> {
    return this.http.get<Bono[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }
}

