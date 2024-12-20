import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericTableComponent } from './../generic-table/generic-table.component';
import { InboxService } from './inbox.service';
import { MatDialog } from '@angular/material/dialog'; 
// import { DialogOverviewExampleDialog } from '../general-modal/general-modal.component';
import { rol } from 'app/mock-api/common/rol/data';
import { Router } from '@angular/router';


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
      color: 'warn',
      action: (row: any) => this.deleteRow(row),
    },
    // {
    //   label: 'Open Modal',
    //   color: 'accent', // Puedes elegir un color diferente
    //   action: (row: any) => this.openCaracterizationModal(row), // Enviar datos de la fila al modal
    // },
  ]; // Botones dinámicos

  constructor(private inboxService: InboxService, private _router: Router) {} // , private dialog: MatDialog

    ngOnInit(): void {
        const roles = localStorage.getItem('accessRoles');
        const cargo = roles ? JSON.parse(roles)[0] : 'Rol';

        if (cargo === 'administrador') {
            const requestBody = { rol: cargo }; // Cuerpo de la solicitud
            this.inboxService.getDataAsJson(requestBody).subscribe(
                (response) => {
                    if (response.length > 0) {
                        // Extraer las columnas dinámicamente de la primera fila
                        this.columns = Object.keys(response[0]).map((key) => ({
                            key: key,
                            label: this.formatLabel(key), // Opcional: Formatea las etiquetas
                        }));
                    }
                    this.data = response; // Asignar los datos de la API
                    console.log('API Response:', this.data); // Verificar los datos devueltos
                    console.log('API columns:', this.columns); // Verificar los datos devueltos
                },
                (error) => {
                    console.error('Error al cargar los datos:', error);
                    // Manejo del error
                }
            );
        }
        else {

        }

    }


    editRow(row: any): void {
      console.log('Edit row:', row);
      this._router.navigateByUrl('/resumen-edit/' + row.id);
      // Lógica para editar una fila
    }
    
    deleteRow(row: any): void {
        console.log('Delete row:', row);
        // Lógica para eliminar una fila
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
    // Insertar espacios antes de cada mayúscula (excepto la primera letra)
    key = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  
    // Convertir la primera letra de cada palabra en mayúscula
    return key.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

