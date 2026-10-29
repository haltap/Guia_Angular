import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Libro {
  id: number;
  codigo: string;
  titulo: string;
  autor: string;
  anio: number;
}

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libro.html'
})
export class LibroComponent implements OnInit {
  libros: Libro[] = [];
  editando = false;
  
  libroForm: Libro = {
    id: 0,
    codigo: '',
    titulo: '',
    autor: '',
    anio: new Date().getFullYear()
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesionBiblioteca');
    if (!sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarLibros();
  }

  cargarLibros() {
    const data = localStorage.getItem('librosBiblioteca');
    this.libros = data ? JSON.parse(data) : [];
  }

  guardarLocalStorage() {
    localStorage.setItem('librosBiblioteca', JSON.stringify(this.libros));
  }

  guardarLibro() {
    if (!this.libroForm.codigo || !this.libroForm.titulo.trim() || !this.libroForm.autor.trim()) {
      alert('Todos los campos son obligatorios y no pueden ser espacios en blanco.');
      return;
    }
    if (this.libroForm.anio < 1000 || this.libroForm.anio > 9999 || !Number.isInteger(Number(this.libroForm.anio))) {
      alert('El año debe ser un número entero entre 1000 y 9999.');
      return;
    }

    if (this.editando) {
      const index = this.libros.findIndex(l => l.id === this.libroForm.id);
      if (index !== -1) {
        this.libros[index] = { ...this.libroForm };
      }
      this.editando = false;
    } else {
      const nuevoId = this.libros.length > 0 ? Math.max(...this.libros.map(l => l.id)) + 1 : 1;
      const nuevoLibro: Libro = { ...this.libroForm, id: nuevoId };
      this.libros.push(nuevoLibro);
    }

    this.guardarLocalStorage();
    this.limpiarFormulario();
  }

  editarLibro(libro: Libro) {
    this.editando = true;
    this.libroForm = { ...libro };
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminarLibro(id: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.libros = this.libros.filter(l => l.id !== id);
      this.guardarLocalStorage();
      if (this.editando && this.libroForm.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  limpiarFormulario() {
    this.libroForm = { id: 0, codigo: '', titulo: '', autor: '', anio: new Date().getFullYear() };
  }

  cerrarSesion() {
    localStorage.removeItem('sesionBiblioteca');
    this.router.navigate(['/login']);
  }
}