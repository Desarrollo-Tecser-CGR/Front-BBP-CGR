import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { HttpClient } from '@angular/common/http';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class RolMockApi {
    private _roles: any[] = [];
    private _rolesdos: any[] = [];

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _httpClient: HttpClient // Inyectamos HttpClient para consumir la API real
    ) {
        // this.fetchRolesFromAPI(); // Llama al método para obtener roles dinámicos
        this.registerHandlers(); // Registra los handlers de Mock API
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/common/roles')
            .reply(() => [200, cloneDeep(this._roles)]);

        this._fuseMockApiService
            .onGet('api/common/rolesdos')
            .reply(() => [200, cloneDeep(this._rolesdos)]);
    }

    /**
     * Fetch roles dynamically from the API
     */
    // private fetchRolesFromAPI(): void {
    //     // Realiza una solicitud POST a la API
    //     this._httpClient
    //         .post<any>('http://192.168.2.30:5500/api/v1/auth/login', {
    //             sAMAccountName: 'bbp.cgr', // Reemplaza con un usuario válido
    //             password: 'Colombia2024*',   // Reemplaza con una contraseña válida
    //         })
    //         .subscribe(
    //             (response) => {
    //                 console.log('Response from API:', response);

    //                 // Extrae el campo "cargo" de la respuesta
    //                 const cargo = response.user?.cargo;

    //                 if (cargo) {
    //                     // Asigna el valor dinámico al rol y roldos
    //                     this._roles = [cargo];
    //                     this._rolesdos = [cargo];
    //                 }
    //             },
    //             (error) => {
    //                 console.error('Error fetching roles:', error);

    //                 // Opcional: Asigna valores predeterminados en caso de error
    //                 this._roles = ['default-role'];
    //                 this._rolesdos = ['default-role'];
    //             }
    //         );
    // }
}
