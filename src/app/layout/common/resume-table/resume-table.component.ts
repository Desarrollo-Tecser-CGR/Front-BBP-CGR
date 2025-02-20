import { NgForOf , NgIf} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-resume-table',
  standalone: true,
  imports: [
    MatStepperModule,
    MatInputModule,
    MatTableModule,
    NgIf
  ],
  templateUrl: './resume-table.component.html',
  styleUrl: './resume-table.component.scss'
})
export class ResumeTableComponent {
  @Input() Id: number;
  id:string = '';
  data: any = {};
  displayedColumns: any[] = [];
  dataSource: any[]= [];
  columns :any[]= [];

  constructor( private resumenService:ResumenService, private route: ActivatedRoute,){}
  ngOnInit(): void{
    this.route.params.subscribe((params)=>{
      this.id = params['id'];
    })

    this.columns = this.resumenService.getColumns();
    this.resumenService.getDataAsJson(this.id).subscribe(
        (response) => {
            this.data = response;
            console.log('Practica:', this.data);
            this.dataSource = this.preparateTableData(this.data, this.columns);
            this.displayedColumns = this.getDisplayedColumns(this.columns);
        },
        (error) => {
            Swal.fire({
                title: 'Error',
                text: `No se pudo abrir la práctica. ${error}`,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    );
  }
  // columnas dinamicas
  getDisplayedColumns(columns: any): any[] {
    const practice = columns[0]
    return Object.keys(practice).filter(
      (key) => typeof columns[key] !== 'object' && !Array.isArray(columns[key])
    );
  }

  // Preparar datos en la tabla
preparateTableData(data: any, columns: any[]): any[] {
  const tableData = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (key === 'files') {
        continue;
      }

      let formattedValue;
      if (Array.isArray(value)) {
        formattedValue = value.length === 0 ? 'N/A' : value.map(item => item.name || JSON.stringify(item)).join(', ');
        ;
      } else if (typeof value === 'object' && value !== null && 'name' in value) {
        formattedValue = value.name;
      } else {
        formattedValue = value;
      }
      const column = columns.find(col => col.key === key);
      const header = column ? column.header : key; 

      tableData.push({ header, value: formattedValue });
    }
  }
  return tableData;
}


  // Método para verificar si un valor es un objeto o un array
  isObjectOrArray(value: any): boolean {
    return typeof value === 'object' || Array.isArray(value);
  }
}
