import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/pacientes'; // Cambia esto con la URL de tu backend

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Asegúrate de que la respuesta sea un arreglo de pacientes
  }
}

