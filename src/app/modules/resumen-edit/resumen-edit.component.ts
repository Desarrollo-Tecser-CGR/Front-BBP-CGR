import { ResumenComponent } from './../resumen/resumen.component';
import { GenericTableComponent } from './../common/generic-table/generic-table.component';
import { Component, Input, ViewEncapsulation, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { ResumenService } from '../resumen/resumen.service';
import { MatDialog } from '@angular/material/dialog';
import { DataServices } from './resumen-edit.service';

// Definición de rutas
const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' } // Ruta por defecto
];

@Component({
    selector     : 'resumen-edit',
    standalone   : true,
    templateUrl  : './resumen-edit.component.html',
    styleUrl     : './resumen-edit.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule,
        ResumenComponent
    ]
})
export class ResumenEditComponent {

    @Input() Id: number;
    id: string | null = null; 
    isEdit: boolean = true;
    formData: any = {};
    showCaracterizationButton: boolean = false;
    /**
     * Constructor
     */
    constructor( private activatedRoute: ActivatedRoute, 
        private resumenService: ResumenService,
        private dataService: DataServices
    ) {}

        
        
    ngOnInit(): void {
        
        // Método 1: Suscripción a cambios de parámetros
        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id']; // Capturar el ID de la URL 
            
            if (this.id) {
                this.loadFormData(this.id);
            }
        });

    }
    private loadFormData(id: string): void {
        this.resumenService.getDataAsJson(id).subscribe({
            next: (data) => {
                this.formData = data;
            },
            error: (error) => {
            }
        });
    }
    
}
