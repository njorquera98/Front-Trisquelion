import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PesoMaximo } from '../models/peso-maximo.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PesoMaximoService {
  private apiUrl = `${environment.apiUrl}/peso-maximo`;

  constructor(private http: HttpClient) { }

  getPesos(pacienteId: number): Observable<PesoMaximo[]> {
    return this.http.get<PesoMaximo[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  addPeso(peso: PesoMaximo): Observable<PesoMaximo> {
    return this.http.post<PesoMaximo>(this.apiUrl, peso);
  }
}
