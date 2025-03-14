import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root'
})
export class InboxService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/resume/inboxBbp`;
    private apiUrlSetStatus = `${GlobalConstants.API_BASE_URL}/api/v1/resume/setValidateStatus`;

    constructor(private http: HttpClient) { }

    getDataAsJson(requestBody: { rol: string; sAMAccountName: string }): Observable<any> { console.log('datos enviados',requestBody);
        return this.http.post<any>(this.apiUrl, requestBody); // Enviar cuerpo de la solicitud
    }

    setValidateStatus(requestBody: { rol: string; id: number }, accessName: string): Observable<any[]> {
        const apiUrlWithAccessName = `${this.apiUrlSetStatus}/${accessName}`;
        return this.http.post<any[]>(apiUrlWithAccessName, requestBody);
    }

}