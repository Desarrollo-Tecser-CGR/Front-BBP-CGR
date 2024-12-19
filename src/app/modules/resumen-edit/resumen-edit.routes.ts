import { Routes } from '@angular/router';
import { ResumenEditComponent } from './resumen-edit.component';


export default [
    {
        path     : ':id',
        component: ResumenEditComponent,
    },
] as Routes;
