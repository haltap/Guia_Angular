import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductoComponent } from './components/producto/producto';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'producto', component: ProductoComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];