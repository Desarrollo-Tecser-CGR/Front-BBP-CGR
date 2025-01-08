import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import { CONFIG } from 'app/config/config';

@Injectable({
    providedIn: 'root'
})
export class ResumenService {

  private apiUrl =  `${CONFIG.apiHost}/api/v1/hojadevida/guardar`;
  private apiUrlGet = `${CONFIG.apiHost}/api/v1/hojadevida/getIdentity`;
  private apiUrlUpdate = `${CONFIG.apiHost}/api/v1/hojadevida/cargar-archivo`;
  private apiUrlDelete = `${CONFIG.apiHost}/api/v1/updateIdentity`;
  
    constructor(private http: HttpClient) { }

    sendUsersForm(formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.apiUrl, formData, { headers });
    }

    getUsers( id: string ): Observable<any> {
        return this.http.get<any>(this.apiUrlGet + '/' + id);
    }

    updateUsers(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${CONFIG.apiHost}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.put(url, formData, { headers });
    }    
    deleteUsers(id: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${CONFIG.apiHost}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.delete(url);
    }    
       
}
