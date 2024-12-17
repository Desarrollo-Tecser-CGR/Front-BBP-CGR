import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { ResumenComponent } from '../resumen/resumen.component';

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
    id: string | null = null; // Variable para almacenar el ID

    /**
     * Constructor
     */
    constructor(private activatedRoute: ActivatedRoute) {

    }

    ngOnInit(): void {
        // Método 1: Suscripción a cambios de parámetros
        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id']; // Capturar el ID de la URL
            console.log('ID capturado:', this.id);
        });

        // Método 2: Obtener el parámetro directamente (para rutas estáticas)
        // this.id = this.activatedRoute.snapshot.params['id'];
        // console.log('ID capturado:', this.id);
    }
}
