import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommitteeService } from './committee.service';
import { ResumenService } from '../resumen/resumen.service';

@Component({
    selector: 'committee',
    standalone: true,
    templateUrl: './committee.component.html',
    styleUrls: ['./committee.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        RouterModule
    ]
})
export class CommitteeComponent implements OnInit {
    id: string | null = null;
    committeeData: any = {}; // Almacenar todos los datos
    showAnswers: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private committeeService: CommitteeService,
        private resumenService: ResumenService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            console.log('ID recibido en Committee:', this.id);
    
            if (this.id) {
                this.loadCommitteeData(Number(this.id));
                this.loadResumenData(this.id); // 🔹 Llamamos a loadResumenData en lugar de getDataAsJson directamente
            }
        });
    }
    

     // 🔹 Método para obtener los datos del comité
     private loadCommitteeData(id: number): void {
        this.committeeService.getCommitteeData(id).subscribe(
            (response) => {
                console.log('Datos del comité:', response.data);
                this.committeeData = response.data;
            },
            (error) => {
                console.error('Error al obtener los datos:', error);
            }
        );
    }

    // 🔹 Método para obtener estadoFlujo y codigoPractica
    private loadResumenData(id: string): void {
        console.log('Cargando datos de resumen para ID:', id);
    
        this.resumenService.getDataAsJson(id).subscribe(
            (response) => {
                console.log('Datos de resumen recibidos:', response);
    
                if (response) {
                    // Mezclar los datos con los existentes sin sobrescribir
                    this.committeeData = {
                        ...this.committeeData, // Mantener los datos actuales
                        estadoFlujo: response.estadoFlujo,
                        codigoPractica: response.codigoPractica
                    };
                } else {
                    console.warn('La respuesta de resumen está vacía o no tiene datos.');
                }
            },
            (error) => {
                console.error('Error al obtener los datos de resumen:', error);
            }
        );
    }    

    // Método para alternar la visibilidad de las respuestas
    toggleAnswers(): void {
        this.showAnswers = !this.showAnswers;
    }
}
