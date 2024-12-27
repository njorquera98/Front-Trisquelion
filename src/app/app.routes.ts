import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { SesionesComponent } from './sesiones/sesiones.component';
import { ConsultasMedicasComponent } from './consultas-medicas/consultas-medicas.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ListaComponent } from './lista/lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lista', component: ListaComponent, canActivate: [AuthGuard] }, //cambiar a lista en un mismo componente puedes trabajar activos e inactivos
  { path: 'sesiones/:id', component: SesionesComponent, canActivate: [AuthGuard] },
  { path: 'consultas/:id', component: ConsultasMedicasComponent, canActivate: [AuthGuard] },
  { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard] },

];
