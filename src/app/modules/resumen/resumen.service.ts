import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import { CONFIG } from '../../config/config';

@Injectable({
    providedIn: 'root'
})
export class ResumenService {
    [x: string]: any;

    // private apiUrl = `${GlobalConstants.API_BASE_URL}hojadevida/guardar`;
    // private uploadUrl = `${GlobalConstants.API_BASE_URL}hojadevida/cargar-archivo`;

    private apiUrl = `${CONFIG.apiHost}/api/v1/hojadevida/guardar`;
    private uploadUrl = `${CONFIG.apiHost}/api/v1/hojadevida/cargar-archivo`;
    private apiUrlGet = `${CONFIG.apiHost}/api/v1/hojadevida/getIdentity`;

    constructor(private http: HttpClient) { }

    sendFormDataAsJson(formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.apiUrl, formData, { headers });
    }

    uploadFile(fileData: FormData): Observable<any> {
        return this.http.post(this.uploadUrl, fileData);
    }

    getDataAsJson( id: string ): Observable<any> {
        return this.http.get<any>(this.apiUrlGet + '/' + id);
    }
}
