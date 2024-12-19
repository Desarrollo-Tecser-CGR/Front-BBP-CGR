import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericTableComponent } from './../generic-table/generic-table.component';
import { InboxService } from './inbox.service';
import { rol } from 'app/mock-api/common/rol/data';
import { Router } from '@angular/router';

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
  cargo: string
  buttons = [
    {
      label: 'Edit',
      color: 'primary',
      action: (row: any) => this.editRow(row),
    },
    {
      label: 'Validar',
      color: 'warn',
      action: (row: any) => this.validateRow(row),
    },
  ]; // Botones dinámicos

  constructor(private inboxService: InboxService, private router: Router) { }

  ngOnInit(): void {
    const roles = localStorage.getItem('accessRoles');
    this.cargo = roles ? JSON.parse(roles)[0] : 'Rol';

    if (this.cargo === 'validador') {
      const requestBody = { rol: this.cargo }; // Cuerpo de la solicitud
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
    // Lógica para editar una fila
  }

  validateRow(row: any): void {
    const requestBody = { rol: this.cargo, id: row.id }; // Cuerpo de la solicitud
    this.inboxService.setValidateStatus(requestBody).subscribe(
      (response) => {
        console.log('holi', response);
        if (response.length > 0) {
          this.columns = Object.keys(response[0]).map((key) => ({
            key: key,
            label: this.formatLabel(key), // Opcional: Formatea las etiquetas
          }));
        }
        this.data = response;
        console.log('API Response:', this.data);
        console.log('API columns:', this.columns);

        // Recargar el componente
        this.router.navigate([this.router.url]);
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }

  private formatLabel(key: string): string {
    // Formatear etiquetas (opcional: transformar "user_name" a "User Name")
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
