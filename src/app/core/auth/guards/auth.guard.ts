import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const requiredRoles: string[] = route.data['requiredRoles'] || [];
    const authService: AuthService = inject(AuthService);

    // Check the authentication status
    return authService
        .check()
        .pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL =
                        state.url === '/sign-out'
                            ? ''
                            : `redirectURL=${state.url}`;
                    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                    return of(urlTree);
                }


                if (requiredRoles.length > 0) {
                    const userRoles: string[] = authService.accessRoles; // Recupera los roles del usuario
                    const hasRequiredRole = requiredRoles.some((role) =>
                        userRoles.includes(role)
                    );

                    if (!hasRequiredRole) {
                        // Redirige a una página de acceso denegado si no tiene roles necesarios
                        const redirectURL =
                            state.url === '/sign-out'
                                ? ''
                                : `redirectURL=${state.url}`;
                        const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                        return of(urlTree);
                    }
                }
                // Allow the access
                return of(true);
            })
        );
};
