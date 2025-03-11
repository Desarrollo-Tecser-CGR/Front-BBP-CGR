import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import { CONFIG } from 'app/config/config';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}entityCgr/getAllEntities`;
    private apiUrlGetByID = `${CONFIG.apiHost}/api/v1/entityCgr/getEntitiesByid`;

    constructor(private http: HttpClient) { }

    getAllEntities(requestBody: { rol: string }): Observable<any> {
        return this.http.get<any>(this.apiUrl); // Enviar cuerpo de la solicitud
    }

    getEntitiesByid(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrlGetByID + '/' + id);
    }

}