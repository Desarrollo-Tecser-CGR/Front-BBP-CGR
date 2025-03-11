import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';



export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
    selector     : 'catalog',
    standalone   : true,
    templateUrl  : './catalog.component.html',
    styleUrl     : './catalog.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatTableModule, 
        RouterOutlet,
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
    ],
})

export class CatalogComponent
{
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource = ELEMENT_DATA;

    formFieldHelpers: string[] = [''];

    /**
     * Constructor
     */
    constructor()
    {
    }
}
