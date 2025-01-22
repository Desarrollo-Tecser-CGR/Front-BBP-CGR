import { user } from './../../mock-api/common/user/data';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, map, Observable, of, ReplaySubject, switchMap, tap, throwError } from 'rxjs';
import { user as userData } from 'app/mock-api/common/user/data';
import { Rol } from '../user/rol.types';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private apiUrl = `${GlobalConstants.API_BASE_URL}auth/login`;

    private _user: any = userData;
    private _roles: ReplaySubject<Rol[]> = new ReplaySubject<Rol[]>(1);

    /**
     * Setter & getter for ROL
     *
     * @param value
     */
    set roles(value: Rol[]) {
        // Store the value
        this._roles.next(value);
    }

    get roles$(): Observable<Rol[]> {
        return this._roles.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set accessNombre(token: string) {
        localStorage.setItem('accessNombre', token);
    }

    get accessNombre(): string {
        return localStorage.getItem('accessNombre') ?? '';
    }
    set accessId(token: string) {
        localStorage.setItem('accessId', token);
    }

    get accessId(): string {
        return localStorage.getItem('accessId') ?? '';
    }

    /**
     * Setter & getter for access token
     */
    set accessRoles(roles: any[]) {
        // Convierte el arreglo a JSON antes de almacenarlo
        localStorage.setItem('accessRoles', JSON.stringify(roles));
    }

    get accessRoles(): any[] {
        // Recupera el valor y lo convierte de JSON a un arreglo
        const roles = localStorage.getItem('accessRoles');
        return roles ? JSON.parse(roles) : [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/register-users', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    getRoles(): Observable<Rol[]> {
        return this._httpClient.get<Rol[]>('api/common/roles').pipe(
            tap((rol) => {
                this._roles.next(rol);
            })
        );
    }

    getRolesDos(): Observable<Rol[]> {
        return this._httpClient.get<Rol[]>('api/common/rolesdos').pipe(
            tap((rol) => {
                this._roles.next(rol);
            })
        );
    }


    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { sAMAccountName: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');

        }

        const auth = {
            sAMAccountName: credentials.sAMAccountName,
            password: credentials.password,
        };


        // return this._httpClient.post(`${GlobalConstants.API_BASE_URL}auth/login`, auth).pipe(


        // return this._httpClient.post(`${GlobalConstants.API_BASE_URL}auth/login`, auth).pipe(


        return this._httpClient.post(`${GlobalConstants.API_BASE_URL}/api/v1/auth/login`, auth).pipe(


            switchMap((response: any) => {
                console.log(response);

                // Store the access token in the local storage
                this.accessToken = response.user.token;
                this.accessNombre = credentials.sAMAccountName;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = this._user;

                const listCargo = [];
                listCargo.push(response.user.cargo);

                this._roles.next(listCargo);
                this.accessRoles = listCargo;

                // if(auth.sAMAccountName == 'bbp.cgr') {

                //     return this.getRoles().pipe(
                //         map((roles) => {
                //             console.log(roles);

                //             this.accessRoles = roles;
                //             // Devuelve un objeto que contiene el token y los roles
                //             return {
                //                 token: response.user.token,
                //                 roles: roles,
                //             };
                //         })
                //     );
                // }

                // if(auth.sAMAccountName == 'user2') {

                //     return this.getRolesDos().pipe(
                //         map((roles) => {
                //             console.log(roles);

                //             this.accessRoles = roles;
                //             // Devuelve un objeto que contiene el token y los roles
                //             return {
                //                 token: response.user.token,
                //                 roles: roles,
                //             };
                //         })
                //     );
                // }

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
