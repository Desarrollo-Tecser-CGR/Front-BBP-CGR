import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
    imagenUrl: 'assets/default-profile.png' // Imagen por defecto
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.obtenerDatosUsuario();
  }

  // obtenerDatosUsuario(): void {
  //   this.http.get<any>('API_URL/directorio-activo')
  //     .subscribe(data => {
  //       this.usuario = { ...data, imagenUrl: this.usuario.imagenUrl };
  //     });
  // }

  cargarImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.usuario.imagenUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }
}