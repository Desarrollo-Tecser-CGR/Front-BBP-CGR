import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { GenaralModalService } from './general-modal.service';
import { Usuario } from './user.type';

@Component({
  selector: 'general-modal.component',
  standalone: true,
  templateUrl: 'general-modal.component.html',
  styleUrls: ['./general-modal.component.scss'], 
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly genaralModalService = inject(GenaralModalService);


  users: Usuario[] = []; // Aquí se almacenarán los usuarios del endpoint
  selectedUser: any; // Usuario seleccionado del desplegable

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers(): void {
    
    this.genaralModalService.getDataAsJson({ rol: 'Administrador' }) 
    .subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response.usuarios.length > 0  &&  Array.isArray(response.usuarios)) {
          this.users = response.usuarios;
        } else {
          console.error('La respuesta no contiene un arreglo válido de usuarios.');
          this.users = [];
        }
        console.log('Usuarios cargados:', this.users);
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }
  

  confirmSelection(): void {
    console.log('Usuario seleccionado:', this.selectedUser);
    this.dialogRef.close(this.selectedUser); // Cierra el modal y envía el usuario seleccionado
  }
}