import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TareaComponent } from './components/tarea/tarea';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tarea', component: TareaComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];