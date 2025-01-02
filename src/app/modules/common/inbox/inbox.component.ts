import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericTableComponent } from './../generic-table/generic-table.component';
import { InboxService } from './inbox.service';
import { MatDialog } from '@angular/material/dialog';
// import { DialogOverviewExampleDialog } from '../general-modal/general-modal.component';
import { rol } from 'app/mock-api/common/rol/data';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'], // Corrección: Usar styleUrls
  imports: [GenericTableComponent, MatDatepickerModule], // Corrección: Mover MatDatepickerModule a imports //// , DialogOverviewExampleDialog
})
export class InboxComponent implements OnInit {
  data: any[] = []; // Datos para la tabla genérica
  columns: { key: string; label: string }[] = []; // Configuración dinámica de las columnas
  cargo: string;

  buttons = [
    {
      // label: 'Edit',
      icon: 'heroicons_outline:pencil-square',
      color: 'primary',
      action: (row: any) => this.editRow(row),
    },
    {
      // label: 'Delete',
      icon: 'heroicons_outline:document-check',
      color: 'accent',
      action: (row: any) => this.validateRow(row),
    },
    // {
    //   label: 'Open Modal',
    //   color: 'accent', // Puedes elegir un color diferente
    //   action: (row: any) => this.openCaracterizationModal(row), // Enviar datos de la fila al modal
    // },
  ]; // Botones dinámicos
  private _router: any;

  constructor(private inboxService: InboxService, private router: Router) { } // , private dialog: MatDialog

  ngOnInit(): void {
    const roles = localStorage.getItem('accessRoles');
    this.cargo = roles ? JSON.parse(roles)[0] : 'Rol';
  
    // Definir botones dinámicamente según el rol
    this.buttons = [
      {
        icon: 'heroicons_outline:pencil-square',
        color: 'primary',
        action: (row: any) => this.editRow(row),
      },
    ];
  
    // Agregar el botón de validación solo para validador y administrador
    if (['validador', 'administrador'].includes(this.cargo)) {
      this.buttons.push({
        icon: 'heroicons_outline:document-check',
        color: 'accent',
        action: (row: any) => this.validateRow(row),
      });
    }
  
    this.loadData();
  }
  

  loadData(): void {
    if (this.cargo === 'validador', 'administrador' , 'caracterizador') {
      const requestBody = { rol: this.cargo }; // Cuerpo de la solicitud
      this.inboxService.getDataAsJson(requestBody).subscribe(
        (dataRes) => {
          let response = dataRes.data;
          if (response.length > 0) {
            // Extraer las columnas dinámicamente de la primera fila
            this.columns = Object.keys(response[0]).map((key) => ({
              key: key,
              label: this.formatLabel(key), // Opcional: Formatea las etiquetas
            }));
          }
          this.data = response; // Asignar los datos de la API
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cargar la información. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          // Manejo del error
        }
      );
    }
    else {

    }
  }


  editRow(row: any): void {
    this.router.navigateByUrl('/resumen-edit/' + row.id);
    // Lógica para editar una fila
  }

  deleteRow(row: any): void {
    console.log('Delete row:', row);
    // Lógica para eliminar una fila
  }

  validateRow(row: any): void {
    const requestBody = { rol: this.cargo, id: row.id }; // Cuerpo de la solicitud
    this.inboxService.setValidateStatus(requestBody).subscribe(
      (response) => {
        if (response.length > 0) {
          this.columns = Object.keys(response[0]).map((key) => ({
            key: key,
            label: this.formatLabel(key), // Opcional: Formatea las etiquetas
          }));
        }
        this.data = response;
        Swal.fire({
          title: '¡Registro Actualizado!',
          text: 'El registro ha sido actualizado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // // Recargar la ruta actual
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([this.router.url]);
          // });
          this.loadData();
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar la información. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
  // ======================== Logica que muestra el modal en la vista ======================== //

  //  openCaracterizationModal(row: any): void {
  //    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //      width: '500px',
  //      data: { name: row?.name || '', animal: row?.animal || '' }, // Pasa los datos de la fila
  //    });

  //    dialogRef.afterClosed().subscribe((result) => {
  //      console.log('Modal cerrado con:', result);
  //      // Puedes actualizar la fila o realizar otra lógica aquí si es necesario
  //    });
  //  }  
  private formatLabel(key: string): string {
    key = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Convertir la primera letra de cada palabra en mayúscula
    return key.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

