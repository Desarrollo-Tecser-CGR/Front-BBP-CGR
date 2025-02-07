import { Component, Input } from '@angular/core';
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
    MatSortModule
  ],
  providers:[],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent {
  selectedFiles: File[] = [];
  displayedColumns:any[]=[];
  auditorias:any[]=[];
  @Input () Id:number;
  identityId : number;
  groups: any[] = [];
  constructor(
    private resumenService:ResumenService,
    private auditService: AuditService
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
      // llamar los grupos 
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
    );      console.log('Grupos:', this.groups)
      // llamar las auditorias por la hoja de vida

    }

}
