import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root' // Disponible en toda la aplicación
})
export class CreateService {
    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/form/save`; // Cambia por tu endpoint del backend

    constructor(private http: HttpClient) {}

    saveFormData(formData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, formData);
    }
}
