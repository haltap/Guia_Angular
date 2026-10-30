import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Estudiante {
  id: number;
  cuenta: string;
  nombre: string;
  carrera: string;
  fechaIngreso: string;
}

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante.html'
})
export class EstudianteComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  editando = false;
  
  estudianteForm: Estudiante = {
    id: 0,
    cuenta: '',
    nombre: '',
    carrera: '',
    fechaIngreso: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesionEstudiantes'); 
    if (!sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    const data = localStorage.getItem('registrosEstudiantes'); 
    this.estudiantes = data ? JSON.parse(data) : [];
  }

  guardarLocalStorage() {
    localStorage.setItem('registrosEstudiantes', JSON.stringify(this.estudiantes)); 
  }

  guardarEstudiante() {
    if (!this.estudianteForm.cuenta || !this.estudianteForm.nombre.trim() || !this.estudianteForm.carrera.trim() || !this.estudianteForm.fechaIngreso) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (this.editando) {
      const index = this.estudiantes.findIndex(e => e.id === this.estudianteForm.id);
      if (index !== -1) {
        this.estudiantes[index] = { ...this.estudianteForm };
      }
      this.editando = false;
    } else {
      const nuevoId = this.estudiantes.length > 0 ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1;
      const nuevoEstudiante: Estudiante = { ...this.estudianteForm, id: nuevoId };
      this.estudiantes.push(nuevoEstudiante);
    }

    this.guardarLocalStorage();
    this.limpiarFormulario();
  }

  editarEstudiante(estudiante: Estudiante) {
    this.editando = true;
    this.estudianteForm = { ...estudiante };
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminarEstudiante(id: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.estudiantes = this.estudiantes.filter(e => e.id !== id);
      this.guardarLocalStorage();
      if (this.editando && this.estudianteForm.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  limpiarFormulario() {
    this.estudianteForm = { id: 0, cuenta: '', nombre: '', carrera: '', fechaIngreso: '' };
  }

  cerrarSesion() {
    localStorage.removeItem('sesionEstudiantes'); 
    this.router.navigate(['/login']);
  }
}