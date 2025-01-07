import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  users: Usuario[] = []; // Usuarios cargados
  selectedUser: any; // Usuario seleccionado
  currentRole: string; // Rol actual del usuario

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private genaralModalService: GenaralModalService,
    @Inject(MAT_DIALOG_DATA) public data: { role: string },
    private http: HttpClient
  ) {
    this.currentRole = data.role; // Obtén el rol desde el componente padre
    this.loadUsers();
  }

  loadUsers(): void {
    this.genaralModalService.getDataAsJson({ rol: 'Administrador' }).subscribe(
      (dataRes) => {
        let response = dataRes.data;
        if (Array.isArray(response)) {
          this.users = this.filterUsersByRole(response);
        } else if (response.usuarios && Array.isArray(response.usuarios)) {
          this.users = this.filterUsersByRole(response.usuarios);
        } else {
          console.error('La respuesta no contiene un arreglo válido de usuarios.');
          this.users = [];
        }
        console.log('Usuarios cargados:', this.users);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  filterUsersByRole(users: Usuario[]): Usuario[] {
    if (this.currentRole === 'administrador') {
      return users; // No se aplica filtro
    } else if (this.currentRole === 'validador') {
      return users.filter((user) => user.cargo === 'caracterizador');
    } else if (this.currentRole === 'caracterizador') {
      return users.filter((user) => user.cargo === 'evaluador');
    }
    return [];
  }

  confirmSelection(): void {
    console.log('Usuario seleccionado:', this.selectedUser);
    this.dialogRef.close(this.selectedUser); // Cerrar el modal con el usuario seleccionado
  }
}
