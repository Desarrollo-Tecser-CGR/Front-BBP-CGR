import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericTableComponent } from './../generic-table/generic-table.component';
import { InboxService } from './inbox.service';
import { rol } from 'app/mock-api/common/rol/data';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'], // Corrección: Usar styleUrls
  imports: [GenericTableComponent, MatDatepickerModule], // Corrección: Mover MatDatepickerModule a imports
})
export class InboxComponent implements OnInit {
  data: any[] = []; // Datos para la tabla genérica
  columns: { key: string; label: string }[] = []; // Configuración dinámica de las columnas
  buttons = [
    {
      label: 'Edit',
      color: 'primary',
      action: (row: any) => this.editRow(row),
    },
    {
      label: 'Delete',
      color: 'warn',
      action: (row: any) => this.deleteRow(row),
    },
  ]; // Botones dinámicos

  constructor(private inboxService: InboxService) {}

  ngOnInit(): void {
    const roles = localStorage.getItem('accessRoles');
    const cargo = roles ? JSON.parse(roles)[0] : 'Rol';

    if(cargo === 'administrador'){
      const requestBody = { rol: 'evaluador ' }; // Cuerpo de la solicitud
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
    else{

    }
    
  }

  editRow(row: any): void {
    console.log('Edit row:', row);
    // Lógica para editar una fila
  }

  deleteRow(row: any): void {
    console.log('Delete row:', row);
    // Lógica para eliminar una fila
  }

  private formatLabel(key: string): string {
    // Formatear etiquetas (opcional: transformar "user_name" a "User Name")
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
