/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Panel',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
        roles: ['administrador', 'validador', 'registro', 'caracterizador', 'jefeUnidad', 'comiteTecnico', 'evaluador', 'seguimiento', 'evolucionador']
    },
    {
        id: 'resumen',
        title: 'Registro',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/resumen',
        roles: ['registro']
    },
    {
        id: 'catalog',
        title: 'Buscar usuario',
        type: 'basic',
        icon: 'heroicons_outline:magnifying-glass-plus',
        link: '/catalog',
        roles: ['administrador']
    },
    // {
    //     id   : 'evolution-questionnaire',
    //     title: 'Evolucionador',
    //     type : 'basic',
    //     icon : 'heroicons_outline:queue-list',
    //     link : '/evolution-questionnaire',
    //     roles: ['administrador', 'evolucionador']
    // },
    {
        id: 'follow',
        title: 'Gestión de usuarios',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/follow',
        roles: ['administrador']
    },
    {
        id: 'publication',
        title: 'Formulario de evaluación',
        type: 'basic',
        icon: 'heroicons_outline:document-duplicate',
        link: '/publication',
        roles: ['administrador']
    },
    {
        id: 'publication-questions',
        title: 'Formulario de evolucionador',
        type: 'basic',
        icon: 'heroicons_outline:pencil-square',
        link: '/publication-questions',
        roles: ['administrador']
    },
    {
        id: 'inbox',
        title: 'Inbox',
        type: 'basic',
        icon: 'heroicons_outline:inbox',
        link: '/inbox',
        roles: ['administrador', 'validador', 'caracterizador', 'jefeUnidad', 'evaluador', 'seguimiento', 'comiteTecnico', 'evolucionador']
    },
    {
        id: 'create',
        title: 'Creación de formularios',
        type: 'basic',
        icon: 'heroicons_outline:newspaper',
        link: '/create',
        roles: ['administrador']

    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];

