import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericTableComponent } from './../generic-table/generic-table.component';
import { InboxService } from './inbox.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FilterService } from 'app/layout/common/advanced-search-modal/FilterService';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  imports: [
    GenericTableComponent,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class InboxComponent implements OnInit {
  data: any[] = []; // Datos para la tabla genérica
  columns: { key: string; label: string }[] = []; // Configuración dinámica de las columnas
  cargo: string;
  fullName: string;
  buttons = [
    {
      // label: 'Edit',
      icon: 'heroicons_outline:pencil-square',
      color: 'primary',
      action: (row: any) => this.editRow(row),
    },
    {
      // label: 'Validate',
      icon: 'heroicons_outline:document-check',
      color: 'accent',
      action: (row: any) => this.validateRow(row),
    },
    // 
  ]; // Botones dinámicos
  private _router: any;

  constructor(private filterService: FilterService, private inboxService: InboxService, private router: Router, private notificationsService: NotificationsService) { } // , private dialog: MatDialog

  ngOnInit(): void {
    const roles = localStorage.getItem('accessRoles');
    this.cargo = roles ? JSON.parse(roles)[0] : 'Rol';
    this.fullName = localStorage.getItem('accessName') || 'Usuario';
    console.log('Fullname inbox', this.fullName);
  
    // Definir botones dinámicamente según el rol

 switch (this.cargo) {
  case 'evaluador':
    this.buttons = [
      {
        icon: 'feather:check-square',
        color: 'primary',
        action: (row: any) => this.evaluatePractice(row),
      },
    ];
    break;

  case 'comiteTecnico':
    this.buttons = [
      {
        icon: 'feather:check-square',
        color: 'primary',
        action: (row: any) => this.openCommittee(row),
      },
    ];
    break;

  case 'seguimiento':
    this.buttons = [
      {
        icon: 'heroicons_outline:users',
        color: 'primary',
        action: (row: any) => this.auditPractice(row),
      },
    ];
    break;

  default:
    this.buttons = [
      {
        icon: 'heroicons_outline:pencil-square',
        color: 'primary',
        action: (row: any) => this.editRow(row),
      },
    ];
    break;
}

    

  
    // Agregar el botón de validación solo para validador y administrador
    if (['validador', 'administrador'].includes(this.cargo)) {
      this.buttons.push({
        icon: 'heroicons_outline:document-check',
        color: 'accent',
        action: (row: any) => this.validateRow(row),
      });
    }
    this.filterService.filter$.subscribe((filters) => {
      if (filters) {
        this.loadData(filters); // Siempre carga datos con los filtros emitidos
      }
    });
    this.loadData();
  }
  

  loadData(filters?: any): void {
 
    if (['validador', 'administrador', 'caracterizador', "jefeUnidad", 'evaluador', 'seguimiento', 'comiteTecnico'].includes(this.cargo)) {
      const requestBody = {
        rol: this.cargo,
        sAMAccountName: this.fullName,
        ...filters, // Agrega los filtros si están definidos
 
      };
      
      console.log('datos cargados:', filters)

      this.inboxService.getDataAsJson(requestBody).subscribe(
        (dataRes) => {
          console.log('Cuerpo de la petición:', requestBody);
 
          console.log('Cuerpo de la petición:', requestBody);

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
  auditPractice(row:any):void{
    if(this.cargo === 'seguimiento'){
      this.router.navigateByUrl('/diffusion/' + row.id)
    }
  }
  evaluatePractice(row:any):void{
    if(this.cargo === 'evaluador'){
      this.router.navigateByUrl('/evaluation-questionnaire/' + row.id);
    }
  }

  editRow(row: any): void {
    // Condición de prueba
    if (this.cargo === 'validador' && row.estadoFlujo !== 'validacion') {
        Swal.fire({
            title: 'Acción no permitida',
            text: 'No puedes editar este registro porque no está en estado de validación.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
        return;
    }
    this.router.navigateByUrl('/resumen-edit/' + row.id);
    // Lógica para editar una fila
  }

  deleteRow(row: any): void {
    // Lógica para eliminar una fila
  }

  validateRow(row: any): void {
    const requestBody = { rol: this.cargo, id: row.id }; // Cuerpo de la solicitud
    const accessName = localStorage.getItem('accessName'); // Obtener el accessName del localStorage

    if (!accessName) {
        return; // Finaliza si no hay accessName
    }

    // Llamar al endpoint con el accessName
    this.inboxService.setValidateStatus(requestBody, accessName).subscribe(
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
                this.loadData(); // Recargar los datos después de la operación
            });
        },
        (error) => {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el estado de flujo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    );
}

  openCommittee(row: any): void {
    if (row && row.id) {
      this.router.navigate(['/committee', row.id]); // Redirige con el ID de la fila
    } else {
      console.warn('No se pudo abrir Comité, el ID es inválido.');
    }
  }

  pageLoad(): void {
    window.location.reload()
  }

  private formatLabel(key: string): string {
    key = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Convertir la primera letra de cada palabra en mayúscula
    return key.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}