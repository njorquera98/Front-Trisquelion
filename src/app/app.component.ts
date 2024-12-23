import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Trisquelion';
  constructor(private router: Router) { } // Inyecta el Router en el constructor

  // Método para verificar si la ruta actual es '/login'
  isLoginPage(): boolean {
    return this.router.url === '/login'; // Ahora puedes usar this.router
  }
}
