import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  estado: string;
}

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea.html'
})
export class TareaComponent implements OnInit {
  tareas: Tarea[] = [];
  editando = false;
  
  tareaForm: Tarea = {
    id: 0,
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    estado: 'Pendiente' 
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesionTareas');
    if (!sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarTareas();
  }

  cargarTareas() {
    const data = localStorage.getItem('agendaTareas');
    this.tareas = data ? JSON.parse(data) : [];
  }

  guardarLocalStorage() {
    localStorage.setItem('agendaTareas', JSON.stringify(this.tareas));
  }

  guardarTarea() {
    if (!this.tareaForm.titulo.trim() || !this.tareaForm.descripcion.trim() || !this.tareaForm.fechaLimite) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (this.editando) {
      const index = this.tareas.findIndex(t => t.id === this.tareaForm.id);
      if (index !== -1) {
        this.tareas[index] = { ...this.tareaForm };
      }
      this.editando = false;
    } else {
      const nuevoId = this.tareas.length > 0 ? Math.max(...this.tareas.map(t => t.id)) + 1 : 1;
      const nuevaTarea: Tarea = { ...this.tareaForm, id: nuevoId };
      this.tareas.push(nuevaTarea);
    }

    this.guardarLocalStorage();
    this.limpiarFormulario();
  }

  editarTarea(tarea: Tarea) {
    this.editando = true;
    this.tareaForm = { ...tarea };
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminarTarea(id: number) {
    if (confirm('¿Está seguro de eliminar esta tarea?')) {
      this.tareas = this.tareas.filter(t => t.id !== id);
      this.guardarLocalStorage();
      if (this.editando && this.tareaForm.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  limpiarFormulario() {
    this.tareaForm = { id: 0, titulo: '', descripcion: '', fechaLimite: '', estado: 'Pendiente' };
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTareas');
    this.router.navigate(['/login']);
  }
}