import { defaultNavigation } from 'app/mock-api/common/navigation/data';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {

                // Obtén los roles del usuario desde localStorage
                const userRoles: string[] = this.getUserRolesFromLocalStorage();

                // Filtra las opciones del menú según los roles
                const filteredNavigation = this.filterNavigationByRoles(navigation, userRoles);


                // Actualiza el BehaviorSubject con la navegación filtrada
                this._navigation.next(filteredNavigation);
            })
        );
    }

    /**
     * Get user roles from localStorage
     */
    private getUserRolesFromLocalStorage(): string[] {
        const roles = localStorage.getItem('accessRoles');
        return roles ? JSON.parse(roles) : [];
    }

    /**
     * Filter navigation by roles
     */
    private filterNavigationByRoles(navigation: Navigation, userRoles: string[]): Navigation {
        // Filtra cada sección de la navegación
        return {
            compact: this.filterItemsByRoles(navigation.compact, userRoles),
            default: this.filterItemsByRoles(navigation.default, userRoles),
            futuristic: this.filterItemsByRoles(navigation.futuristic, userRoles),
            horizontal: this.filterItemsByRoles(navigation.horizontal, userRoles)
        };
    }

    /**
     * Filter an array of FuseNavigationItem by roles
     */
    private filterItemsByRoles(items: FuseNavigationItem[], userRoles: string[]): FuseNavigationItem[] {
        return items
            .map((item) => {
                // Verifica si el usuario tiene alguno de los roles requeridos
                const hasAccess = item.roles ? item.roles.some((role) => userRoles.includes(role)) : true;

                // Si el usuario no tiene acceso, omite la opción
                if (!hasAccess) {
                    return null;
                }

                // Si la opción tiene hijos, también filtra recursivamente
                if (item.children) {
                    item.children = this.filterItemsByRoles(item.children, userRoles);
                }

                return item;
            })
            .filter((item) => item !== null); // Elimina los elementos nulos
    }
}
