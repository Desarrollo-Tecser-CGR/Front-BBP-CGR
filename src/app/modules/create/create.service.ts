import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../config/config';

@Injectable({
    providedIn: 'root' // Disponible en toda la aplicación
})
export class CreateService {
    private apiUrl = `${CONFIG.apiHost}/api/v1/form/guardar`; // Cambia por tu endpoint del backend

    constructor(private http: HttpClient) {}

    saveFormData(formData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, formData);
    }
}
