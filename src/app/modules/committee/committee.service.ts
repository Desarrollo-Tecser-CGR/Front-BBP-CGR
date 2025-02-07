import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/admin/record`; // URL base de la API

  constructor(private http: HttpClient) {}

  // Método para obtener los datos del comité por ID
  getCommitteeData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/2`);
  }
}
