import { Component, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { GenericTableComponent } from "../../../modules/common/generic-table/generic-table.component";
import { FilesTableServices } from './files-table.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { DataServices } from 'app/modules/resumen-edit/resumen-edit.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-files-table',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './files-table.component.html',
  styleUrl: './files-table.component.scss',
})
export class FilesTableComponent {
  IdAudit:number;
  CodeAudit:string;
  startDate: string = this.formatDate(new Date());
  dataFiles: any;
  columns: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private filesServices: FilesTableServices, 
    private cdr:ChangeDetectorRef,
    private dataService: DataServices,
  ){
    this.IdAudit = data.idAudit;
    this.CodeAudit = data.codeAudit;
    this.getFiles(this.IdAudit);
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  buttons = [
    {
        icon: 'heroicons_outline:arrow-down-tray',
        color:'accent',
        action: (row: any) => this.downloadFile(row),
    },
    {
        icon: 'heroicons_outline:magnifying-glass-circle',
        color:'primary',
        action: (row: any) => this.visualizeFile(row),
    }
]
  ngOnInit():void{
    this.columns = this.filesServices.getColumns();
    console.log('Mostrar archivos-columnas:',this.columns);
  }
  getFiles(idAudit:number) {
      this.getFilesByAudit(idAudit).subscribe(
        (files)=>{
          console.log('Files:', files);
          this.dataFiles=files;
        },
        (error) =>{
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener los archivos.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
        }
      ); 
      console.log('Files filtrados ts:', this.dataFiles);
    }
  
  

  downloadFile(row: any) {
    this.dataService.downloadFile(row.id)
  }
  visualizeFile(row: any) {
    this.dataService.viewFile(row.id);
  }

  submitForm() {
  throw new Error('Method not implemented.');
  }

  getFilesByAudit(idAudit:number){
    return this.filesServices.getFilesByAudit(idAudit);
  }

}
