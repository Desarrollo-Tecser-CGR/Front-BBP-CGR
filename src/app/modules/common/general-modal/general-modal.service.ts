import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import { Users } from './user.type';

@Injectable({
    providedIn: 'root'
})
export class GenaralModalService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user`;

    constructor(private http: HttpClient) { }

    getDataAsJson(requestBody: { rol: string }): Observable<any> {
        return this.http.get<Users>(this.apiUrl); // Enviar cuerpo de la solicitud
    }

}