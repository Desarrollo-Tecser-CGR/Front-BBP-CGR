import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { ResumenComponent } from '../resumen/resumen.component';
import { ResumenService } from '../resumen/resumen.service';

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

    /**
     * Constructor
     */
    constructor(private activatedRoute: ActivatedRoute,
        private resumenService: ResumenService

    ) {

    }

    ngOnInit(): void {
        // Método 1: Suscripción a cambios de parámetros
        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id']; // Capturar el ID de la URL
            console.log('ID capturado:', this.id);
            
            if (this.id) {
                this.loadFormData(this.id);
            }
        });

        // Método 2: Obtener el parámetro directamente (para rutas estáticas)
        // this.id = this.activatedRoute.snapshot.params['id'];
        // console.log('ID capturado:', this.id);
    }
    private loadFormData(id: string): void {
        this.resumenService.getDataAsJson(id).subscribe({
            next: (data) => {
                this.formData = data;
                console.log('Datos cargados para edición:', this.formData);
            },
            error: (error) => {
                console.error('Error al cargar los datos del formulario:', error);
            }
        });
    }
    
}