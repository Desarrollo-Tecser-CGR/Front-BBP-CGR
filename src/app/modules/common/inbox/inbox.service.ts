import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root'
})
export class InboxService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}hojadevida/inbox-bbp`;
    private apiUrlSetStatus = `${GlobalConstants.API_BASE_URL}hojadevida/setValidateStatus`;

    constructor(private http: HttpClient) { }

    getDataAsJson(requestBody: { rol: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, requestBody); // Enviar cuerpo de la solicitud
    }

    setValidateStatus(requestBody: { rol: string; id: string  }): Observable<any[]> {
        return this.http.post<any[]>(this.apiUrlSetStatus, requestBody); // Enviar cuerpo de la solicitud
    }

}