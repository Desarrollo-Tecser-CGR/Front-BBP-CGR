/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Panel',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
        roles: ['administrador', 'validador', 'registro' , 'caracterizador', 'jefeUnidad', 'comiteTecnico', 'evaluador', 'seguimiento', 'evolucionador']
    },
    {
        id   : 'resumen',
        title: 'Registro',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-document-list',
        link : '/resumen',
        roles: ['administrador', 'registro']
    },
    {
        id   : 'caracterization',
        title: 'Caracterización',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/caracterization',
        roles: ['administrador' , 'caracterizador', 'jefeUnidad']
    },
    {
        id   : 'catalog',
        title: 'Catalogar',
        type : 'basic',
        icon : 'heroicons_outline:document-duplicate',
        link : '/catalog',
        roles: ['administrador']
    },
    // {
    //     id   : 'assessment',
    //     title: 'Evaluación',
    //     type : 'basic',
    //     icon : 'heroicons_outline:queue-list',
    //     link : '/assessment',
    //     roles: ['administrador', 'evaluador']
    // },

    // {
    //     id   : 'evolution-questionnaire',
    //     title: 'Evolucionador',
    //     type : 'basic',
    //     icon : 'heroicons_outline:queue-list',
    //     link : '/evolution-questionnaire',
    //     roles: ['administrador', 'evolucionador']
    // },
    {
        id   : 'follow',
        title: 'Gestión de usuarios',
        type : 'basic',
        icon : 'heroicons_outline:presentation-chart-line',
        link : '/follow',
        roles: ['administrador']
    },
    {
        id   : 'publication',
        title: 'Publicación',
        type : 'basic',
        icon : 'heroicons_outline:megaphone',
        link : '/publication',
        roles: ['administrador']
    },
    {
        id   : 'publication-questions',
        title: 'Formulario de Evolucionador',
        type : 'basic',
        icon : 'heroicons_outline:megaphone',
        link : '/publication-questions',
        roles: ['administrador']
    },
    {
        id   : 'inbox',
        title: 'Inbox',
        type : 'basic',
        icon : 'heroicons_outline:inbox',
        link : '/inbox',
        roles: ['administrador', 'validador' , 'caracterizador', 'jefeUnidad', 'evaluador','seguimiento', 'comiteTecnico', 'evolucionador']
    },
    // {
    //     id   : 'comiteTecnico',
    //     title: 'comiteTecnico',
    //     type : 'basic',
    //     icon : 'heroicons_outline:inbox',
    //     link : '/comiteTecnico',
    //     roles: ['administrador', 'validador' , 'caracterizador', 'jefeUnidad', 'evaluador','seguimiento', 'comiteTecnico']
    // },
    {
        id   : 'create',
        title: 'Creación de Formularios',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/create',
        roles: ['administrador']

    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
