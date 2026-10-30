import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.html'
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  editando = false;
  
  productoForm: Producto = {
    id: 0,
    codigo: '',
    nombre: '',
    precio: 0,
    existencias: 0
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesionTienda'); 
    if (!sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProductos();
  }

  cargarProductos() {
    const data = localStorage.getItem('productosTienda'); 
    this.productos = data ? JSON.parse(data) : [];
  }

  guardarLocalStorage() {
    localStorage.setItem('productosTienda', JSON.stringify(this.productos)); 
  }

  guardarProducto() {
    if (!this.productoForm.codigo || !this.productoForm.nombre.trim()) {
      alert('El código y el nombre son obligatorios.');
      return;
    }
    if (this.productoForm.precio <= 0) {
      alert('El precio debe ser mayor que cero.'); 
      return;
    }
    if (this.productoForm.existencias < 0 || !Number.isInteger(Number(this.productoForm.existencias))) {
      alert('Las existencias deben ser un número entero mayor o igual que cero.'); 
      return;
    }

    if (this.editando) {
      const index = this.productos.findIndex(p => p.id === this.productoForm.id);
      if (index !== -1) {
        this.productos[index] = { ...this.productoForm };
      }
      this.editando = false;
    } else {
      const nuevoId = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
      const nuevoProducto: Producto = { ...this.productoForm, id: nuevoId };
      this.productos.push(nuevoProducto);
    }

    this.guardarLocalStorage();
    this.limpiarFormulario();
  }

  editarProducto(producto: Producto) {
    this.editando = true;
    this.productoForm = { ...producto };
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminarProducto(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.id !== id);
      this.guardarLocalStorage();
      if (this.editando && this.productoForm.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  limpiarFormulario() {
    this.productoForm = { id: 0, codigo: '', nombre: '', precio: 0, existencias: 0 };
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTienda');
    this.router.navigate(['/login']);
  }
}