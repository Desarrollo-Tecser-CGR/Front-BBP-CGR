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
    
}
