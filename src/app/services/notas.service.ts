import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../models/notas.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private apiUrl = `${environment.apiUrl}/nota`;

  constructor(private http: HttpClient) { }

  getNotas(pacienteId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  addNota(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota);
  }
}
