import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  propietario: string;
}

@Component({
  selector: 'app-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascota.html'
})
export class MascotaComponent implements OnInit {
  mascotas: Mascota[] = [];
  editando = false;
  
  mascotaForm: Mascota = {
    id: 0,
    nombre: '',
    especie: '',
    edad: 0,
    propietario: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesionVeterinaria');
    if (!sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarMascotas();
  }

  cargarMascotas() {
    const data = localStorage.getItem('mascotasVeterinaria');
    this.mascotas = data ? JSON.parse(data) : [];
  }

  guardarLocalStorage() {
    localStorage.setItem('mascotasVeterinaria', JSON.stringify(this.mascotas));
  }

  guardarMascota() {
    if (!this.mascotaForm.nombre.trim() || !this.mascotaForm.especie.trim() || !this.mascotaForm.propietario.trim()) {
      alert('Todos los campos son obligatorios y distintos de espacios.');
      return;
    }
    if (this.mascotaForm.edad < 0 || !Number.isInteger(Number(this.mascotaForm.edad))) {
      alert('La edad debe ser un número entero mayor o igual que cero.');
      return;
    }

    if (this.editando) {
      const index = this.mascotas.findIndex(m => m.id === this.mascotaForm.id);
      if (index !== -1) {
        this.mascotas[index] = { ...this.mascotaForm };
      }
      this.editando = false;
    } else {
      const nuevoId = this.mascotas.length > 0 ? Math.max(...this.mascotas.map(m => m.id)) + 1 : 1;
      const nuevaMascota: Mascota = { ...this.mascotaForm, id: nuevoId };
      this.mascotas.push(nuevaMascota);
    }

    this.guardarLocalStorage();
    this.limpiarFormulario();
  }

  editarMascota(mascota: Mascota) {
    this.editando = true;
    this.mascotaForm = { ...mascota };
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminarMascota(id: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.mascotas = this.mascotas.filter(m => m.id !== id);
      this.guardarLocalStorage();
      if (this.editando && this.mascotaForm.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  limpiarFormulario() {
    this.mascotaForm = { id: 0, nombre: '', especie: '', edad: 0, propietario: '' };
  }

  cerrarSesion() {
    localStorage.removeItem('sesionVeterinaria');
    this.router.navigate(['/login']);
  }
}