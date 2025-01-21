import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  private apiUrl =  `${GlobalConstants.API_BASE_URL}/api/v1/user/createUser`;
  private apiUrlGet = `${GlobalConstants.API_BASE_URL}/api/v1/user`;
  private apiUrlUpdate = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/cargar-archivo`;
  private apiUrlDelete = `${GlobalConstants.API_BASE_URL}/api/v1/updateIdentity`;
  
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
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.put(url, formData, { headers });
    }    
    deleteUsers(id: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.delete(url);
    }    
       
}
