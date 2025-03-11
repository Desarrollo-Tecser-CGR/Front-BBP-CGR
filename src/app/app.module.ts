import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AuditsMockApi } from './mock-api/common/audits/api';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule, // Necesario para Angular Material
    MatTableModule,          // Módulo de tablas
    MatPaginatorModule,      // Módulo de paginación
    MatButtonModule,
],
  providers: [AuditsMockApi, {provide: LOCALE_ID, useValue: 'es-ES'}],
  bootstrap: []
})
export class AppModule { }