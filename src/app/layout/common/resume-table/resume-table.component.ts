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

  constructor( private resumenService:ResumenService, private route: ActivatedRoute,){}
  ngOnInit(): void{
    this.route.params.subscribe((params)=>{
      this.id = params['id'];
    })
    console.log('Id en tabla generica:', this.id);

    this.resumenService.getDataAsJson(this.id).subscribe(
        (response) => {
            this.data = response;
            console.log('Práctica:', this.data);
            this.dataSource = this.preparateTableData(this.data);
            this.displayedColumns = this.getDisplayedColumns(this.dataSource);

            console.log('Columnas:', this.displayedColumns);
            console.log('Data Source:',this.dataSource);
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
  getDisplayedColumns(data: any): any[] {
    console.log('Data en el display de columns:', data);
    const practice = data[0]
    return Object.keys(practice).filter(
      (key) => typeof data[key] !== 'object' && !Array.isArray(data[key])
    );
  }
  // preparar datos en la tabla
  preparateTableData(data: any): any[] {
    console.log('Data en la preparación de la tabla:', data);
    const tableData = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if(key === 'files'){
              continue;  
            }
            if (Array.isArray(value) ) {
                if (value.length === 0) {
                    tableData.push({ key, value: 'N/A' });
                } 
                else {
                    tableData.push({ key, value });
                }
            } 
            else if (typeof value === 'object' && value !== null && 'name' in value) {
                tableData.push({ key, value: value.name });
            } 
            else {
                tableData.push({ key, value });
            }
        }
    }

    return tableData;
}


  // Método para verificar si un valor es un objeto o un array
  isObjectOrArray(value: any): boolean {
    return typeof value === 'object' || Array.isArray(value);
  }
}
