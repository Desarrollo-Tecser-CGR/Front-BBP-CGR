import { Routes } from '@angular/router';
import { CommitteeComponent } from './committee.component';

export default [
    {
        path: ':id',  // Ahora acepta un ID como parámetro en la URL
        component: CommitteeComponent,
    },
] as Routes;
