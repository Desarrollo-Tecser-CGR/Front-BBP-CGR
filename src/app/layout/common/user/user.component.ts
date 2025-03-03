import { BooleanInput } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy {
    static ngAcceptInputType_showAvatar: BooleanInput;

    @Input() showAvatar: boolean = true;
    user: User | null = null;
    userRoles: string[] = [];
    selectedRole: string = 'Sin Rol';
    userImage: string | null = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService
    ) { }

    goToSettings(): void {
        this._router.navigate(['/settings']);
    }

    ngOnInit(): void {
        // Recuperar datos desde el localStorage
        const fullName = localStorage.getItem('accessName') || 'Usuario';
        const roles = localStorage.getItem('accessRoles');
        const cargo = roles ? this.capitalizeFirstLetter(JSON.parse(roles)[0]) : 'Rol';
        const id = localStorage.getItem('accessId') || 'Sin ID';

        // Recuperar imagen de perfil en base64 (si existe)
        this.userImage = localStorage.getItem('userImage') || null;

        // Inicializar `this.user` con datos del Local Storage
        this.user = { fullName, cargo, id };

        // Recuperar roles
        this.userRoles = roles ? JSON.parse(roles) : [];
        this.selectedRole = this.userRoles.length > 0 ? this.userRoles[0] : 'Sin Rol';

        // Marcar para detección de cambios
        this._changeDetectorRef.markForCheck();

        // Suscribirse a cambios del usuario desde el servicio
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = { ...this.user, ...user };
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    updateUserStatus(status: string): void {
        if (!this.user) {
            return;
        }

        this._userService.update({ ...this.user, status }).subscribe();
    }

    signOut(): void {
        this._router.navigate(['/sign-out']);
    }

    private capitalizeFirstLetter(value: string): string {
        return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
    }

    formatCharge(charge: string | undefined): string {
        if (!charge) return 'Cargo';

        const chargeFormatted = charge.trim().toLowerCase();

        switch (chargeFormatted) {
            case 'jefeunidad':
                return 'Jefe de Unidad';
            case 'comitetecnico':
                return 'Comité Técnico';
            default:
                return charge;
        }
    }

}
