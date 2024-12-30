import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        // Guarda el token en localStorage o sessionStorage
        this.authService.saveToken(response.accessToken);

        // Redirige a la página de pacientes activos
        this.router.navigate(['/lista']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Credenciales incorrectas o error en el servidor');
      },
    });
  }
}
