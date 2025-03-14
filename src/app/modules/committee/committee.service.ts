import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private apiUrlForms = `${GlobalConstants.API_BASE_URL}/api/v1/admin/form/11`;
  private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/admin/record`; //Api que trae los datos de evaluación
  private apiUrlSetValidateStatus = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity`;
  // private apiUrlGetIdentity = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getIdentity`; //Api que trae los datos de resumen 2 datos 

  constructor(private http: HttpClient) {}

  // Método para obtener los datos del comité por ID
  getCommitteeData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/1/${id}`);
  }

  updateDataAsJson(id: string, formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Convertir id a number justo cuando lo usamos en la URL
    const idNumber = Number(id);

    const url = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity/${idNumber}`;
    console.log('ID a actualizar:', idNumber);
    console.log('Datos a enviar:', formData);

    return this.http.patch(url, formData, { headers, responseType: 'text' as 'json' });
  }

  // Método para obtener los formularios con role_form = 11
  getFormsWithRole11(): Observable<any> {
    return new Observable(observer => {
      this.http.get<any>(this.apiUrlForms).subscribe(
        response => {
          console.log('🔍 Datos obtenidos de /form/11:', response);
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error('❌ Error al obtener los formularios con role_form 11:', error);
          observer.error(error);
        }
      );
    });
  }
}