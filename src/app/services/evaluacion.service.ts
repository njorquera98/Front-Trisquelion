import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluacion } from '../models/evaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = 'http://localhost:3000/evaluaciones'; // Asegúrate de usar la URL correcta

  constructor(private http: HttpClient) { }

  // Crear evaluación
  createEvaluacion(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.apiUrl, evaluacion);
  }

  // Obtener todas las evaluaciones
  getEvaluaciones(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.apiUrl);
  }

  // Obtener evaluación por ID
  getEvaluacion(id: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`);
  }

  // Obtener la última evaluación de un paciente
  getLastEvaluacionByPaciente(pacienteId: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.apiUrl}/last/${pacienteId}`);
  }

  // Actualizar evaluación
  updateEvaluacion(id: number, evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.put<Evaluacion>(`${this.apiUrl}/${id}`, evaluacion);
  }

}

