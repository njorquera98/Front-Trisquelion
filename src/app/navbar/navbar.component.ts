import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();  // Elimina el token del almacenamiento
    this.router.navigate(['/login']);  // Redirige a la ruta de login
  }

  redirigirLista(): void {
    this.router.navigate([`/lista`]);
  }

  redirigirAsistencia(): void {
    this.router.navigate([`/asistencia`]);
  }
}
