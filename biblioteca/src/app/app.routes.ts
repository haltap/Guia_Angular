import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { LibroComponent } from './components/libro/libro';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'libro', component: LibroComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];