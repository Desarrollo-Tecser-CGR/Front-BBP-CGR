import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        CommonModule
    ]
})
export class ExampleComponent implements OnInit  {
    roles: string[] = [];
    rol: string = '';
    ngOnInit(): void {
         this.roles = JSON.parse(localStorage.getItem('accessRoles'));
         this.rol = this.roles[0] 
    }
}  
