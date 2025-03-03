import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiUrl}/email`;

  constructor(private http: HttpClient) { }

  enviarDocumento(codigoValidacion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar/${codigoValidacion}`, {});
  }
}

