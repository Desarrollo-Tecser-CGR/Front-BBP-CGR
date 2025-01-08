import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../../../modules/optionsDropdown/characterization/characterization.component';

const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' } // Ruta por defecto
];

@Component({
    selector: 'app-button-menu',
    templateUrl: './buttonMenu.component.html',
    styleUrl: './buttonMenu.component.scss',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule],
})
export class ButtonMenuComponent {

    /**
     * Constructor
     */
    constructor(
    ) {

    }
}
