import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] =
        compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] =
        defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] =
        horizontalNavigation;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
            // Obtener el rol del usuario desde localStorage
            const userRole = localStorage.getItem('accessRoles')
                ? JSON.parse(localStorage.getItem('accessRoles')!)[0]
                : 'default';

            // Buscar el ítem "Inbox" y actualizar su ícono según el rol
            this._defaultNavigation.forEach((item) => {
                if (item.id === 'inbox') {
                    item.icon = this.getInboxIcon(userRole);
                }
            });

            // Llenar los otros tipos de navegación
            this._compactNavigation.forEach((compactNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === compactNavItem.id) {
                        compactNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            this._futuristicNavigation.forEach((futuristicNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === futuristicNavItem.id) {
                        futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            this._horizontalNavigation.forEach((horizontalNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === horizontalNavItem.id) {
                        horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            // Retornar la navegación actualizada
            return [
                200,
                {
                    compact: cloneDeep(this._compactNavigation),
                    default: cloneDeep(this._defaultNavigation),
                    futuristic: cloneDeep(this._futuristicNavigation),
                    horizontal: cloneDeep(this._horizontalNavigation),
                },
            ];
        });
    }

    /**
     * Devuelve el icono del Inbox según el rol del usuario
     */
    private getInboxIcon(role: string): string {
        switch (role.toLowerCase()) {
            case 'validador':
                return 'heroicons_outline:check-badge';
            case 'caracterizador':
                return 'heroicons_outline:inbox-arrow-down';
            case 'evaluador':
                return 'heroicons_outline:document-check';
            default:
                return 'heroicons_outline:inbox'; // Ícono por defecto
        }
    }
}
