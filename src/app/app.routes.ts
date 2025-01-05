import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { PacienteComponent } from './paciente/paciente.component';
import { ListaComponent } from './lista/lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lista', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard] },
];
