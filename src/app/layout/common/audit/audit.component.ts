import { Component, Input, ViewEncapsulation, ViewChild, AfterViewInit, inject} from '@angular/core';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuditService } from './audit.service'
import { NgForOf, NgIf, NgClass, CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FilesTableComponent } from "../files-table/files-table.component";
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { head, slice } from 'lodash';
import { MatButtonModule } from '@angular/material/button';
import { P } from '@angular/cdk/keycodes';
import { MatIcon } from '@angular/material/icon';
import { ProgressAuditComponent } from '../progress-audit/progress-audit.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    NgForOf,
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIcon,
    ProgressAuditComponent,
    NgClass

],
  providers:[],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
  encapsulation: ViewEncapsulation.None,
 
})
export class AuditComponent implements AfterViewInit{

  @ViewChild(ProgressAuditComponent) progress!:ProgressAuditComponent;
  id: string | null = null;
  selectedFiles: File[]=[];
  dateUploadSelected:string=''; 
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
  isSelect:boolean;
  total:number = 0;
  active:number = 0;
  inactive:number = 0;
  counts:any[]=[];
  currentDate: Date = new Date(); 
  readonly dialog = inject(MatDialog)

  ngAfterViewInit(): void {
      
  } 
  
  constructor(
    private resumenService:ResumenService,
    private auditService: AuditService,
  ){}
    openFilesTab(idAudit:number, codeAudit:string ){
      console.log(`idAudit:${idAudit}, codeAudit:${codeAudit}`);
      this.dialog.open(FilesTableComponent,{
        data: {
          idAudit:idAudit,
          codeAudit:codeAudit
        }
      });
    }
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
    onClickDate(date:string){
      this.dateUploadSelected = date;
      this.isSelect = true;
      console.log('Date seleccionada:', this.dateUploadSelected);
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
            this.displayedColumns = [...headers.map((_, index) => index.toString()), 'acciones']; 

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
      this.getProgress();
      this.getPerodicityDays();
    }
    submitDocumentoActuacion(idAudit:number): void {
      console.log('Carga auditoria', idAudit);

          if (this.selectedFiles.length > 0) {
              const formData = new FormData();

            this.selectedFiles.forEach((file) => {
              // formData.append('files', file, file.name);
              formData.append('files', file);
            });

            const dateAudit = this.dateUploadSelected;
            formData.append('dateAudit', dateAudit);

              // Enviamos los archivos al servicio
              this.auditService.postAuditFiles(idAudit,formData).subscribe(
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
                    console.error('Carga de archivos',error);
                      Swal.fire({
                          title:  'Error',
                          text: `Error al cargar los documentos: ${error.error}`,
                          icon: 'error',
                          confirmButtonText: 'Aceptar',
                      })
                  }
              );
          } else {
          }
      }

    ngOnInit():void{
      this.getAllCounts();
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
    }
    getPerodicityDays(){
      this.auditService.getPeriocityByAudit(this.idAudit).subscribe(
        (response)=>{
          this.periodicity = response.days;
        },
        (error)=>{
          Swal.fire({
            title:  'Error',
            text: 'Error al cargar la periodicidad.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
        }
      );
    }
    getAllCounts(){
      this.auditService.getAuditsCounts().subscribe(
        (response)=>{
          this.total = response.total;
          console.log('Contador total,',this.total);
          this.inactive = response.inactive;
          this.active = response.active;
          this.counts = [
            {label:'Total de auditorias', count:this.total, icon:'heroicons_outline:arrow-long-right', color:'orange'},
            {label:'Auditorias inactivas', count:this.active, icon:'heroicons_outline:arrow-down-left', color:'red'},
            {label:'Auditorias activas', count:this.inactive, icon:'heroicons_outline:arrow-up-right', color:'orange'},]
        },
        (error)=>{
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener los contadores.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      )
    }
    getProgress(){
      this.auditService.getProgressByAudit(Number(this.idAudit)).subscribe(
        (response)=>{
          console.log('Progress', response.progress);
          this.progress.updateProgress(response.progress);
        },
        (error)=>{
          Swal.fire({
            title: 'Error',
            text: 'Error al cargar el progreso.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      );
    }

    preparateTableData(data: any, columns: any[]): {headers:string[], tableData:any[][]} {
      console.log('Data en la preparación de la tabla:', data);
      console.log('Columns:', columns);
      
      const headers = columns.map(col=>col.header);
      const estadoHeader = headers.indexOf('Estado');

      console.log('Columnas en la tabla:', headers);
      const tableData = data.map(audit =>
        columns.map((col, index)=>{
          const value = audit[col.key];

          if(Array.isArray(value)){
            return value.length === 0 ? 'N/A':value;
          }
          if (typeof value === 'object' && value !== null && 'name' in value){
            return value.name;
          }
          if (index === estadoHeader && (value === 'activo' || value === 'inactivo')) {
            const colorClass = value === 'activo' ? 'text-green-700' : 'text-red-700';
            const bgColor = value === 'activo' ? 'bg-green-700' : 'bg-red-700';
            return `
              <div class="${colorClass} flex items-center gap-2">
                <span class="${bgColor} w-2 h-2 rounded-full"></span>
                <p>${String(value).charAt(0).toUpperCase() + String(value).slice(1)}</p>
              </div>
            `;
          }
      
          return value !== undefined ? value : 'N/A';
        })
      );
    
      
      console.log('Tabla a mostrar:', tableData);
      return {headers, tableData};
    }
  
  // ======================== Funciones de next y back en cambos numericos ======================== //
scrollLeft() {
  const container = document.querySelector('.max-w-3x.overflow-x-auto') as HTMLElement;
  if (container) {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }
}

scrollRight() {
  const container = document.querySelector('.max-w-3x.overflow-x-auto') as HTMLElement;
  if (container) {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }
}
}

