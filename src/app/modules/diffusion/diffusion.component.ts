import { Component, Input, HostListener } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ResumeTableComponent } from 'app/layout/common/resume-table/resume-table.component';
import { AuditComponent } from 'app/layout/common/audit/audit.component';
import { ActivatedRoute } from '@angular/router';
import { EmailAuditComponent } from "../../layout/common/email-audit/email-audit.component";
import { MatDivider } from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { DialogOverviewExampleDialog } from '../../modules/common/general-modal/general-modal.component'; 
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-diffusion',
  standalone: true,
  imports: [
    MatTabsModule,
    ResumeTableComponent,
    AuditComponent,
    EmailAuditComponent,
    MatDivider,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './diffusion.component.html',
  styleUrls: ['./diffusion.component.scss']
})
export class DiffusionComponent {
  @Input() Id: number;
  id: string = '';
  selectedUserFromModal: any = null;
  additionalInfoFromModal: string = '';
  selectedUsersFromModal: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private resumenService: ResumenService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.id = idFromRoute || '';
    console.log('id en difusion:', this.id);
  }

  performEvolution(): void {
    if (!this.id) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró un ID válido para realizar la evolución.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (!this.selectedUsersFromModal.length) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar al menos un usuario antes de continuar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const idAsNumber = Number(this.id);
    const nuevoEstadoFlujo = 'evolucion';

    // Recorrer cada usuario seleccionado y enviar la petición
    this.selectedUsersFromModal.forEach(user => {
      const updatedData = {
        actualizaciones: {
          estadoFlujo: nuevoEstadoFlujo, 
        },
        sAMAccountName: user.userName, 
        estadoFlujo: nuevoEstadoFlujo,
        comentarioUsuario: this.additionalInfoFromModal || '' 
      };

      console.log('Enviando datos para usuario:', updatedData.sAMAccountName);

      this.resumenService.updateDataAsJson(idAsNumber, updatedData).subscribe(
        (response) => {
          console.log(`Evolución realizada para: ${updatedData.sAMAccountName}`);
        },
        (error) => {
          console.error(`Error al actualizar usuario ${updatedData.sAMAccountName}:`, error);
        }
      );
    });

    // Limpiar los datos después de enviar la evolución
    this.clearSelection();

    Swal.fire({
      title: 'Proceso en curso',
      text: 'Se están procesando los cambios, por favor espera.',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      window.location.href = './example'; 
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {
        role: 'seguimiento',
        selectedUser: this.selectedUserFromModal, 
        selectedUsers: this.selectedUsersFromModal || [], 
        additionalInfo: this.additionalInfoFromModal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedUserFromModal = result.selectedUser || null;
        this.selectedUsersFromModal = result.selectedUsers || []; 
        this.additionalInfoFromModal = result.additionalInfo || '';

        console.log('Usuarios seleccionados:', this.selectedUsersFromModal);
        console.log('Información adicional:', this.additionalInfoFromModal);
      }
    });
  }

  // Método para limpiar la selección
  clearSelection(): void {
    this.selectedUsersFromModal = [];
    this.additionalInfoFromModal = '';
    console.log('Selección limpiada después de la evolución.');
  }

  // Limpiar los datos al recargar la página o cambiar de pestaña
  @HostListener('window:beforeunload', ['$event'])
  clearOnReload(event: Event): void {
    this.clearSelection();
  }
}
