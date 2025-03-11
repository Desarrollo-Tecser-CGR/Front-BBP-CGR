import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

interface Usuario {
  id: number;
  name: string;
  email: string;
  cargo: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user`;
  

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.data)) {
          return response.data.map((user: any) => ({
            id: user.idUser,
            name: user.userName,
            email: user.email,
            cargo: user.cargo,
            estado: user.enabled === true ? true : false
          }));
        }
        return [];
      })
    );
  }
}
