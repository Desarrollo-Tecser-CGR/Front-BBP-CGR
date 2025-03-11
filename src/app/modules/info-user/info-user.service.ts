import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaracterizationService {
  private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user/profile_image`;
  private userApiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la imagen de perfil del usuario por su ID
   * @param userId ID del usuario (ejemplo: 3003)
   * @returns Observable con la URL de la imagen
   */
  getProfileImage(userId: number): Observable<string> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(''); // Devuelve un string vacío sin lanzar error
        }
        return throwError(() => error); // Solo lanza errores que no sean 404
      })
    );
  }
  
  // Cargar la imagen de perfil del usuario
  uploadProfileImage(userId: number, formData: FormData): Observable<any> {
    const url = `${GlobalConstants.API_BASE_URL}/api/v1/user/upload_image/${userId}`;
    return this.http.post(url, formData, { responseType: 'text' }); // Especificamos que la respuesta es texto
  }  

  // Obtener la información del usuario Nombre, Correo y Cargo
  getUserData(userId: number): Observable<any> {
    const url = `${GlobalConstants.API_BASE_URL}/api/v1/user/${userId}`;
    return this.http.get<any>(url);
  }
  
}
