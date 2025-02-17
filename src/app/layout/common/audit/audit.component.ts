import { Component, Input, ViewEncapsulation} from '@angular/core';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuditService } from './audit.service'
import { NgForOf, NgIf } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FilesTableComponent } from "../files-table/files-table.component";
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { head } from 'lodash';
import { MatButtonModule } from '@angular/material/button';
import { P } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    NgForOf,
    NgIf,
    MatDivider,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FilesTableComponent,
    MatRadioModule,
    MatButtonToggleModule,
    MatButtonModule,
],
  providers:[],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AuditComponent {
  id: string | null = null;
  selectedFiles: File[] = [];
  displayedColumns:any[]=[];
  audits:any[]=[];
  idAudit:number;
  codeAudit:string;
  btnRadio:string='all';
  identityId : number;
  groups: any[] = [];
  selectedGroup: any;
  selectedAudit:any;
  indicators:any[]=[];
  periodicity:any[]=[];
  columns:any[]=[];
  dataSource:any[]=[];
  headers:string[]=[];
  tableData:any[]=[];
  constructor(
    private resumenService:ResumenService,
    private auditService: AuditService,
  ){}

    onFilesSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files) {
          this.selectedFiles = Array.from(input.files);
      } else {
      }
  }
      onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            this.selectedFiles = Array.from(event.dataTransfer.files);
        }
    }
    onSelectedGroup(value:any){
      this.selectedGroup=value;
      console.log('Grupo', this.selectedGroup)
    }
    onRadioChecked(value:string){
      this.btnRadio=value;
      this.getAudits();
      console.log('Radio seleccionado:',this.btnRadio)
    }
    onSelectedAudit(value:any){
      this.selectedAudit = value;
      console.log('Aditoria seleccionada', this.selectedAudit);
    }
    getAudits(){
      if (this.btnRadio === 'all') {
        this.auditService.getAudits().subscribe(
          (response) => {
            console.log('Datos en el componente', response);
            this.audits = response || [];
            const { headers, tableData } = this.preparateTableData(this.audits, this.columns);
            this.headers = headers;    
            this.dataSource = tableData;    
            this.displayedColumns = headers.map((_, index) => index.toString()); 

          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener auditorías.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          });
      } else {
          this.auditService.getAuditGroups(this.btnRadio).subscribe(
            (response)=>{
              this.audits = response ;
              const { headers, tableData } = this.preparateTableData(this.audits, this.columns);
              this.headers = headers;    
              this.dataSource = tableData;    
              this.displayedColumns = headers.map((_, index) => index.toString()); 
            },
            (error)=>{
              Swal.fire({
                title: 'Error',
                text: 'Error al obtener auditorías.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
            )}
      }
    onClickAudit(row:any){
      const id = row[0];
      this.idAudit = id;
      this.selectedAudit = row;
      this.codeAudit =row[1];
      console.log('Auditoria seleccionada:', this.selectedAudit);
      console.log('Auditoria ID:', this.idAudit)
    }
    submitDocumentoActuacion(identityId:number): void {

          if (this.selectedFiles.length > 0) {
              const formData = new FormData();

            this.selectedFiles.forEach((file) => {
              // formData.append('files', file, file.name);
              formData.append('files', file);
            });


              // Enviamos los archivos al servicio
              this.resumenService.uploadFile(identityId,formData).subscribe(
                  (response) => {
                      Swal.fire({
                          title: '¡Actualización Exitosa!',
                          text: 'Documentos cargados correctamente.',
                          icon: 'success',
                          confirmButtonText: 'Aceptar',
                      })
                      // Limpiamos la selección tras el envío exitoso
                      this.selectedFiles = [];
                  },
                  (error) => {
                      Swal.fire({
                          title:  'Error',
                          text: 'Error al cargar los documentos.',
                          icon: 'error',
                          confirmButtonText: 'Aceptar',
                      })
                  }
              );
          } else {
          }
      }

    ngOnInit():void{
      this.getAudits();
      this.columns = this.auditService.getColumns();
      this.auditService.getAllGroups().subscribe(
        (response)=>{
          this.groups = response;
        },
        (error)=>{
          Swal.fire({
            title:  'Error',
            text: 'Error al cargar los grupos.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
        }
      );      
      console.log('Grupos:', this.groups)
        // llamar las auditorias por la hoja de vida
      this.periodicity= this.auditService.getPerodicityDays();
    }

    preparateTableData(data: any, columns: any[]): {headers:string[], tableData:any[][]} {
      console.log('Data en la preparación de la tabla:', data);
      console.log('Columns:', columns);
      
      const headers = columns.map(col=>col.header);
      console.log('Columnas en la tabla:', headers);
      const tableData = data.map(audit =>
        columns.map(col=>{
          const value = audit[col.key];

          if(Array.isArray(value)){
            return value.length === 0 ? 'N/A':value;
          }
          if (typeof value === 'object' && value !== null && 'name' in value){
            return value.name;
          }
          return value !== undefined ? value : 'N/A';
        })
      );
    
      
      console.log('Tabla a mostrar:', tableData);
      return {headers, tableData};
    }
  }