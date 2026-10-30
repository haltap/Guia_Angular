import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    if (this.usuario === 'registro' && this.password === 'alumnos123') { 
      localStorage.setItem('sesionEstudiantes', 'activo'); 
      this.router.navigate(['/estudiante']);
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}