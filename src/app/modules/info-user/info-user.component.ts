// perfil.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CaracterizationService } from './info-user.service';

@Component({
  selector: 'caracterization',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
    imports: [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      CommonModule,
    ]
})
export class InfoUserComponent implements OnInit {
  usuario = {
    nombres: '',
    apellidos: '',
    usuario: '',
    cargo: '',
    telefono: '',
    imagenUrl: '' 
  };

  constructor(private caracterizationService: CaracterizationService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('Iduser'); // Obtiene el ID del usuario logueado
  
    if (userId) {
      const numericUserId = Number(userId); 
      this.getProfileImage(Number(userId)); // Convierte el ID a número y lo usa
      this.getUserData(numericUserId);
    } else {
      console.error('No se encontró el Iduser en localStorage');
    }
  }

  // ======================== Trae la foto de la base de datos y la muestra ========================= //
  getProfileImage(userId: number): void {
    this.caracterizationService.getProfileImage(userId).subscribe(
      (base64Image: string) => {
        this.usuario.imagenUrl = base64Image || null; // Si no hay imagen, se deja como null
        if(base64Image=="imagen no encontrada") {
          this.usuario.imagenUrl = null;
        }
      },
      (error) => {
        if (error.status === 404) {
          console.warn('No se encontró la imagen de perfil, mostrando icono.');
        } else {
          console.error('Error al obtener la imagen del perfil', error);
        }
        this.usuario.imagenUrl = null; // Icono en vez de imagen por defecto
      }
    );
  }

  // ======================== Permite cargar una nueva imagen al campo ========================= //
  uploadImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const userId = localStorage.getItem('Iduser'); // Obtiene el ID del usuario logueado
  
      if (!userId) {
        console.error('No se encontró el Iduser en localStorage');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', file); // La key debe ser 'image' según Postman
  
      this.caracterizationService.uploadProfileImage(Number(userId), formData).subscribe(
        () => {
          // Actualiza la imagen localmente
          const reader = new FileReader();
          reader.onload = (e: any) => this.usuario.imagenUrl = e.target.result;
          reader.readAsDataURL(file);
        },
        (error) => {
          console.error('Error al subir la imagen', error);
        }
      );
    }
  }  

  // ======================== Obtiene los datos y los muestra Nombre, Correo y Cargo ========================= //
  getUserData(userId: number): void {
    this.caracterizationService.getUserData(userId).subscribe(
        (data: any) => {
            console.log('Datos del usuario recibidos:', data); // 🔍 Verifica los datos en consola

            this.usuario.nombres = data.userName; // 🔹 userName en vez de fullName
            this.usuario.usuario = data.email; // 🔹 Email como correo
            this.usuario.cargo = data.roles?.length > 0 ? data.roles[0].name : 'Sin cargo'; // 🔹 Extraer el rol si existe
        },
        (error) => {
            console.error('Error al obtener los datos del usuario', error);
        }
    );
  }
}