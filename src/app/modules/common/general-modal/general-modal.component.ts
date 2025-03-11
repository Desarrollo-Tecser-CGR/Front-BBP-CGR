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
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectorRef } from '@angular/core';

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
    CommonModule,
    MatInputModule
  ],
})
export class DialogOverviewExampleDialog {
  users: Usuario[] = []; // Usuarios cargados
  selectedUser: any; // Usuario seleccionado
  selectedUsers: Usuario[] = []; // Usuarios seleccionados (para selección múltiple)
  currentRole: string; // Rol actual del usuario
  additionalInfo: string = ''; // Información adicional

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private genaralModalService: GenaralModalService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { role: string, selectedUser: any, selectedUsers: Usuario[], additionalInfo: string },
  ) {}

  ngOnInit(): void {
    this.currentRole = this.data.role;
    this.selectedUser = this.data.selectedUser || null;
    this.selectedUsers = this.data.selectedUsers || []; // Asegúrate de manejar correctamente la lista de usuarios seleccionados
    this.additionalInfo = this.data.additionalInfo || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.genaralModalService.getDataAsJson({ rol: 'Administrador' }).subscribe(
      (dataRes) => {
        console.log("Respuesta completa del servicio:", dataRes); // Ver toda la respuesta
        let response = dataRes.data;
  
        if (Array.isArray(response)) {
          console.log("Usuarios antes del filtro:", response);
          this.users = this.filterUsersByRole(response);
        } else if (response.usuarios && Array.isArray(response.usuarios)) {
          console.log("Usuarios antes del filtro:", response.usuarios);
          this.users = this.filterUsersByRole(response.usuarios);
        } else {
          this.users = [];
        }
  
        console.log("Usuarios filtrados por rol:", this.users); // Ver los usuarios que se muestran en el modal
      },
      (error) => {
        console.error("Error al cargar usuarios:", error);
      }
    );
  }
  

  filterUsersByRole(users: Usuario[]): Usuario[] {
    if (this.currentRole === 'administrador') {
      return users;
    } else if (this.currentRole === 'validador') {
      return users.filter((user) => user.cargo === 'caracterizador');
    } else if (this.currentRole === 'evaluador') {
      return users.filter((user) => user.cargo === 'evaluador');
    } else if (this.currentRole === 'caracterizador') {
      return users.filter((user) => user.cargo === 'evaluador' || user.cargo === 'jefeUnidad');
    } else if (this.currentRole === 'comiteTecnico') {
      return users.filter((user) => user.cargo === 'seguimiento');
    } else if (this.currentRole === 'seguimiento') {
      return users.filter((user) => user.cargo && user.cargo.toLowerCase().trim() === 'evolucionador');
    }    
    return [];
  }

  handleSelectionChange(): void {
    if (this.currentRole === 'caracterizador') {
      // Si se selecciona un jefe de unidad, deseleccionamos los evaluadores
      const selectedUsersCopy = [...this.selectedUsers]; // Hacemos una copia del arreglo de usuarios seleccionados
      const jefeDeUnidad = this.selectedUsers.find(user => user.cargo === 'jefeUnidad');
  
      // Si hay un jefe de unidad seleccionado, deseleccionamos los evaluadores
      if (jefeDeUnidad) {
        // Filtramos los evaluadores que estén seleccionados y los deseleccionamos
        this.selectedUsers = selectedUsersCopy.filter(user => user.cargo !== 'evaluador');
      }
    }
    
    // Si el rol es 'validador' y hay más de un usuario seleccionado, permitimos seleccionar solo uno
    if ((this.currentRole === 'validador' || this.currentRole === 'comiteTecnico') && this.selectedUsers.length > 1) {
      this.selectedUsers = [this.selectedUsers[0]]; // Solo permite un usuario si es 'validador'
    }
    if (this.currentRole === 'seguimiento') {
      this.selectedUsers = this.selectedUsers.filter(user => user.cargo === 'evolucionador');
  }
  }

  confirmSelection(): void {
    this.dialogRef.close({
      selectedUser: this.selectedUser,
      selectedUsers: this.selectedUsers, // Asegúrate de enviar la propiedad correcta
      additionalInfo: this.additionalInfo,
    }); 
  }

  compareUsers(user1: Usuario, user2: Usuario): boolean {
    return user1 && user2 ? user1.fullName === user2.fullName : user1 === user2;
  }
}