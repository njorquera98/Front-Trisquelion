import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth/login'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    // Elimina el token JWT del almacenamiento local o de sesión
    localStorage.removeItem('authToken');  // Si lo almacenas en localStorage
    sessionStorage.removeItem('authToken');  // Si lo almacenas en sessionStorage
  }

  // Agrega la lógica para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken');
  }
}

