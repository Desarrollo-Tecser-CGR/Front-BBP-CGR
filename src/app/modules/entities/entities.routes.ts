import { Routes } from '@angular/router';
import { EntitiesComponent } from './entities.component';
// import { EntitiesComponent } from './entities.component';
// import { EditEntitiesComponent } from './edit-entities/edit-entities.component';


export default [
    {
        path     : '',
        component: EntitiesComponent,
    }
    // {
    //     path: 'edit/:id', // Ruta con un parámetro dinámico
    //     // component: EditEntitiesComponent,
    // },
] as Routes;
