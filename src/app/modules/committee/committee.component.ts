import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
    selector     : 'committee',
    standalone   : true,
    templateUrl  : './committee.component.html',
    styleUrls    : ['./committee.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule
    ]
})
export class CommitteeComponent {
    cards = [
        { name: 'bbp2.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 1, color: 'blue' },
        { name: 'bbp3.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 2, color: 'blue' },
        { name: 'bbp4.cgr', title: 'Estado de Flujo', description: 'Evaluada', value: 3, color: 'blue' }
    ];

    constructor() {}
}
