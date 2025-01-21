import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root',
})
export class SignInService {

   // private apiUrl = `${GlobalConstants.API_BASE_URL}auth/loginActiveDirectory`;
    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/auth/loginActiveDirectory`;

    //private apiUrl = `${GlobalConstants.API_BASE_URL}auth/login`;

    constructor(private http: HttpClient) {}

    sendFormData(data: { sAMAccountName: string; password: string }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }
}
