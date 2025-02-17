import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GenericTableComponent } from "../../../modules/common/generic-table/generic-table.component";
import { FilesTableServices } from './files-table.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-files-table',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './files-table.component.html',
  styleUrl: './files-table.component.scss',
})
export class FilesTableComponent implements OnChanges {
  @Input() IdAudit:number;
  @Input() CodeAudit:string;
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

  startDate: string = this.formatDate(new Date());
  data: any;
  columns: any;
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
    console.log('Mostrar archivos-columnas:',this.columns)    
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['IdAudit'] && changes['IdAudit'].currentValue !== undefined) {
      this.data = [...this.getFilesByAudit(changes['IdAudit'].currentValue)]; // Clonamos el array
  
      if (this.data.length === 0) {
        this.data = [{ message: 'No hay archivos aún.', empty: true }]; // Mantenemos el array
      }
  
      console.log('Files filtrados ts:', this.data);
    }
  }
  

  downloadFile(row: any) {
    throw new Error('Method not implemented.');
  }
  visualizeFile(row: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private filesServices: FilesTableServices, private cdr:ChangeDetectorRef){

  }
  submitForm() {
  throw new Error('Method not implemented.');
  }

  getFilesByAudit(idAudit:number){
    return this.filesServices.getFilesByAudit(idAudit);
  }

}
