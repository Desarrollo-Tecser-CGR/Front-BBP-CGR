import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  private apiUrl =  `${CONFIG.apiHost}/api/v1/hojadevida/guardar`;
  private uploadUrl = `${CONFIG.apiHost}/api/v1/hojadevida/cargar-archivo`;

  constructor(private http: HttpClient) {}

  sendFormDataAsJson(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, formData, { headers });
  }

  uploadFile(fileData: FormData): Observable<any> {
    return this.http.post(this.uploadUrl, fileData);
  }
}
