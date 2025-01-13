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

  createBono(bonoData: Bono): Observable<Bono> {
    return this.http.post<Bono>(this.apiUrl, bonoData);
  }

  getBonoById(bonoId: number): Observable<Bono> {
    return this.http.get<Bono>(`${this.apiUrl}/${bonoId}`);
  }

  updateBono(bonoId: number, bono: Bono): Observable<Bono> {
    return this.http.patch<Bono>(`${this.apiUrl}/${bonoId}`, bono);
  }
}

