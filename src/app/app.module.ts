import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { GenericTableComponent } from '../app/modules/common/generic-table/generic-table.component';

@NgModule({
  declarations: [
     // Asegúrate de declarar tu componente aquí
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule, // Necesario para Angular Material
    MatTableModule,          // Módulo de tablas
    MatPaginatorModule,      // Módulo de paginación
    MatButtonModule 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }