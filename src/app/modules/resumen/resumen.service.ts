import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root'
})
export class ResumenService {

  private apiUrl =  `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/guardar`;
  private uploadUrl = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/cargar-archivo`;
  private apiUrlGet = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/getIdentity`;
  private apiUrlUpdate = `${GlobalConstants.API_BASE_URL}/api/v1/updateIdentity`;
  
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

    updateDataAsJson(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.put(url, formData, { headers });
    }    
       
}
