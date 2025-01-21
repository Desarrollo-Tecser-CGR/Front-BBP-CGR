import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    // private apiUrl = 'http://192.168.2.42:8001/api/v1/log';
    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/log`;
    
    constructor(private http: HttpClient) {}

    getLogs(): Observable<any[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map((response) =>
                response.data
                    .map((log, index) => ({
                        id: index + 1,
                        nombre: log.name_user,
                        sesion: `${new Date(log.data_session_start).toLocaleDateString()} ${new Date(log.data_session_start).toLocaleTimeString()}`,
                        rol: log.userCargo,
                        estado: log.enable ? 'Activo' : 'Inactivo',
                    }))
                    .sort((a, b) => 
                        new Date(b.sesion).getTime() - new Date(a.sesion).getTime() // Orden descendente por fecha
                    )
            )
        );
    }
}