// perfil.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CaracterizationService } from './caracterization.service';

@Component({
  selector: 'caracterization',
  templateUrl: './caracterization.component.html',
  styleUrls: ['./caracterization.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
    imports: [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      CommonModule,
    ]
})
export class CaracterizationComponent implements OnInit {
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
    this.obtenerImagenPerfil(30032);
    // this.obtenerDatosUsuario();
  }

  
  // obtenerDatosUsuario(): void {
  //   this.http.get<any>('API_URL/directorio-activo')
  //     .subscribe(data => {
  //       this.usuario = { ...data, imagenUrl: this.usuario.imagenUrl };
  //     });
  // }

  obtenerImagenPerfil(userId: number): void {
    this.caracterizationService.getProfileImage(userId).subscribe(
      (base64Image: string) => {
        if (base64Image) {
          this.usuario.imagenUrl = base64Image;
        } else {
          this.usuario.imagenUrl = 'http://meredithcnn.images.worldnow.com/images/10389401_G.jpg';
        }
      },
      (error) => {
        if (error.status === 404) {
          console.warn('No se encontró la imagen de perfil, usando imagen por defecto.');
        } else {
          console.error('Error al obtener la imagen del perfil', error);
        }
        this.usuario.imagenUrl = 'http://meredithcnn.images.worldnow.com/images/10389401_G.jpg';
      }
    );
  }  

  cargarImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.usuario.imagenUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }
}