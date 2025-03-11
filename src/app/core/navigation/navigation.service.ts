import { defaultNavigation } from 'app/mock-api/common/navigation/data';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { FuseNavigationService } from '@fuse/components/navigation';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    constructor(private _fuseNavigationService: FuseNavigationService) {}

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                const userRoles: string[] = this.getUserRolesFromLocalStorage();
                const filteredNavigation = this.filterNavigationByRoles(navigation, userRoles);
                this._navigation.next(filteredNavigation);
            })
        );
    }

    /**
     * Toggle navigation
     */
    toggleNavigation(name: string): void {
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);
        if (navigation) {
            navigation.toggle();
        }
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
        return {
            compact: this.filterItemsByRoles(navigation.compact, userRoles),
            default: this.filterItemsByRoles(navigation.default, userRoles),
            futuristic: this.filterItemsByRoles(navigation.futuristic, userRoles),
            horizontal: this.filterItemsByRoles(navigation.horizontal, userRoles),
        };
    }

    /**
     * Filter an array of FuseNavigationItem by roles
     */
    private filterItemsByRoles(items: FuseNavigationItem[], userRoles: string[]): FuseNavigationItem[] {
        return items
            .map((item) => {
                const hasAccess = item.roles ? item.roles.some((role) => userRoles.includes(role)) : true;
                if (!hasAccess) {
                    return null;
                }
                if (item.children) {
                    item.children = this.filterItemsByRoles(item.children, userRoles);
                }
                return item;
            })
            .filter((item) => item !== null);
    }
}
