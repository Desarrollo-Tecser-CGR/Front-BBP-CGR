import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class CaracterizationService {
  private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user/profile_image`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la imagen de perfil del usuario por su ID
   * @param userId ID del usuario (ejemplo: 3003)
   * @returns Observable con la URL de la imagen
   */
  getProfileImage(userId: number): Observable<string> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, { responseType: 'text' }); // Cambiar de 'blob' a 'text'
  }  
}
