import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Trisquelion';
  constructor(private router: Router) { } // Inyecta el Router en el constructor

  // Método para verificar si la ruta actual es '/login'
  isLoginPage(): boolean {
    return this.router.url === '/login'; // Ahora puedes usar this.router
  }


  // Variable para almacenar el estado del tema
  isDarkMode: boolean = false;

  ngOnInit() {
    initFlowbite();
    // Cargar el tema desde el almacenamiento local, si existe
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Establecer el tema predeterminado según la preferencia del sistema
      this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Aplicar el tema en el body
    this.applyTheme(this.isDarkMode);
  }

  toggleTheme() {
    // Cambiar el estado del tema
    this.isDarkMode = !this.isDarkMode;

    // Aplicar el tema y guardar la preferencia en el almacenamiento local
    this.applyTheme(this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme(isDark: boolean) {
    if (isDark) {
      // Aplicar clase 'dark' al body
      document.body.classList.add('dark');
    } else {
      // Eliminar clase 'dark' del body
      document.body.classList.remove('dark');
    }
  }
}
