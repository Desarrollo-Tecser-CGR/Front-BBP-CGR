import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'committee',
    standalone: true,
    templateUrl: './committee.component.html',
    styleUrls: ['./committee.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule
    ]
})
export class CommitteeComponent implements OnInit {
    id: string | null = null;
    cards: any[] = [];

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        // Captura el ID de la URL
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            console.log('ID recibido en Committee:', this.id);

            // Simulación de carga de datos basada en el ID
            this.loadCommitteeData(this.id);
        });
    }

    private loadCommitteeData(id: string | null): void {
        if (!id) return;
        
        // Aquí podrías hacer una petición a la API con el ID.
        // Por ahora, filtraremos los datos de `cards` de prueba.
        const allData = [
            { id: '1', name: 'bbp2.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 1, color: 'blue' },
            { id: '2', name: 'bbp3.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 2, color: 'blue' },
            { id: '3', name: 'bbp4.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 3, color: 'blue' }
        ];

        this.cards = allData.filter(card => card.id === id);
        console.log('Datos filtrados:', this.cards);
    }
}
