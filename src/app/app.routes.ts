import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PacientesActivosComponent } from './pacientes-activos/pacientes-activos.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'activos', component: PacientesActivosComponent, canActivate: [AuthGuard] }
];
