import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GenericTableComponent } from "../common/generic-table/generic-table.component";
import { EntitiesService } from './entities.service';


@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './entities.component.html',
  styleUrl: './entities.component.scss'
})
export class EntitiesComponent implements OnInit {
  data: any[] = []; // Datos para la tabla genérica
  columns: { key: string; label: string }[] = []; // Configuración dinámica de las columnas
  cargo: string;

  buttons = [
    {
      // label: 'Edit',
      icon: 'heroicons_outline:pencil-square',
      color: 'primary',
      action: (row: any) => this.router.navigateByUrl('/resumen-edit/' + row.id),
    }
    
    // {
    //   label: 'Open Modal',
    //   color: 'accent', // Puedes elegir un color diferente
    //   action: (row: any) => this.openCaracterizationModal(row), // Enviar datos de la fila al modal
    // },
  ]; // Botones dinámicos
  private _router: any;
constructor(private entitiesService: EntitiesService, private router: Router) { } // , private dialog: MatDialog
  ngOnInit(): void {
    const roles = localStorage.getItem('accessRoles');
    this.cargo = roles ? JSON.parse(roles)[0] : 'Rol';
  
    // Definir botones dinámicamente según el rol
    this.buttons = [
      {
        icon: 'heroicons_outline:pencil-square',
        color: 'primary',
        action: (row: any) => this.router.navigate(['/entities/edit/' + row.id]),
      },
    ];
  
    
  
    this.loadData();
  }

  loadData(): void {
      if (this.cargo === 'validador', 'administrador' , 'caracterizador') {
        const requestBody = { rol: this.cargo }; // Cuerpo de la solicitud
        this.entitiesService.getAllEntities(requestBody).subscribe(
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

    private formatLabel(key: string): string {
      key = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  
      // Convertir la primera letra de cada palabra en mayúscula
      return key.replace(/\b\w/g, (char) => char.toUpperCase());
    }
}
