/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Panel',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
        roles: ['administrador', 'validador', 'natural']
    },
    {
        id   : 'resumen',
        title: 'Registro',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-document-list',
        link : '/resumen',
        roles: ['administrador', 'natural']
    },
    {
        id   : 'caracterization',
        title: 'Caracterización',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/caracterization',
        roles: ['administrador', 'validador']

    },
    {
        id   : 'catalog',
        title: 'Catalogar',
        type : 'basic',
        icon : 'heroicons_outline:document-duplicate',
        link : '/catalog',
        roles: ['administrador']
    },
    {
        id   : 'assessment',
        title: 'Evaluación',
        type : 'basic',
        icon : 'heroicons_outline:queue-list',
        link : '/assessment',
        roles: ['administrador']
    },
    {
        id   : 'follow',
        title: 'Seguimiento',
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
        id   : 'inbox',
        title: 'Inbox',
        type : 'basic',
        icon : 'heroicons_outline:inbox',
        link : '/inbox',
        roles: ['administrador']
    },
    {
        id   : 'create',
        title: 'Creación de Formularios',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/create',
        roles: ['administrador', 'validador']

    }
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
