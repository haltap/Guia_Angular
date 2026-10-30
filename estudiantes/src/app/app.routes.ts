import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EstudianteComponent } from './components/estudiante/estudiante';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'estudiante', component: EstudianteComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];