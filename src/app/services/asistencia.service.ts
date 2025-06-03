import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/asistencia`;

  constructor(private http: HttpClient) { }

  // Agregar un horario
  registrarAsistencia(horario: Asistencia): Observable<any> {
    return this.http.post<Asistencia>(this.apiUrl, horario);
  }
}



