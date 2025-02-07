import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommitteeService } from './committee.service';

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

    // 🛠 Inyecta `CommitteeService` en el constructor
    constructor(
        private activatedRoute: ActivatedRoute,
        private committeeService: CommitteeService
    ) {}

    ngOnInit(): void {
        // Captura el ID de la URL
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            console.log('ID recibido en Committee:', this.id);
    
            // Llamar al método del servicio para obtener los datos
            if (this.id) {
                this.loadCommitteeData(Number(this.id)); // Convertir el ID a número
            }
        });
    }

    private loadCommitteeData(id: number): void {
        this.committeeService.getCommitteeData(id).subscribe(
            (response) => {
                const committeeData = response.data; // Accedemos a la propiedad 'data' de la respuesta
                console.log('Datos del comité:', committeeData);

                // Transformar los datos para la vista
                this.cards = committeeData.formEntity.questions.map((question: any) => ({
                    name: question.enunciado,
                    title: question.tipoPregunta,
                    description: question.comentario,
                    value: question.peso,
                    color: 'blue'
                }));

                console.log('Datos transformados para mostrar en cards:', this.cards);
            },
            (error) => {
                console.error('Error al obtener los datos:', error);
            }
        );
    }
}
