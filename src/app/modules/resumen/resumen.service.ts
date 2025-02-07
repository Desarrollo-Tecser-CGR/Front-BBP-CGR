import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import registerUsersRoutes from '../auth/register-users/register-users.routes';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';

@Injectable({
    providedIn: 'root',
})
export class ResumenService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/resume/save`;
    private uploadUrl = `${GlobalConstants.API_BASE_URL}/api/v1/resume/uploadFile`;
    private apiUrlGet = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getIdentity`;
    private apiUrlUpdate = `${GlobalConstants.API_BASE_URL}/api/v1/updateIdentity`;
    private apiUrlSetValidateStatus = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity`;
    private apiUrlgetdates = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getAllTypes`;
    private apiUrlEntities = `${GlobalConstants.API_BASE_URL}/api/v1/entityCgr/getAllEntities`;

    // Propiedades para almacenar datos compartidos
    private typesData: { [key: string]: any[] } = {};
    public typeStrategyIdentifications: any[] = [];
    public isDataLoaded: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient,
    ) {}

    sendFormDataAsJson(formData: any, sAMAccountName: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const apiUrlWithAccountName = `${this.apiUrl}/${sAMAccountName}`; // Concatenar el nombre al endpoint

        return this.http.post(apiUrlWithAccountName, formData, { headers }).pipe(
            map((response: any) => {

                const id = response.data.id;
                return response;
            }),
            catchError((e) => {
                console.error('Error al obtener los datos:', e);
                return throwError(e);
            }),
        );
    }
    uploadFile(identityId: number, fileData: FormData): Observable<any> {
        return this.http.post(this.uploadUrl+`?identityId=${identityId}` , fileData);
    }

    getDataAsJson(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrlGet + '/' + id);
    }

    updateDataAsJson(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity/${id}`;
        console.log('ID a actualizar:', id);
        console.log('Datos a enviar:', formData);
        return this.http.patch(url, formData, { headers, responseType: 'text' as 'json' }); // Cambiar responseType a 'text'
    }
    

    updateStateWithPatch(id: number, updatedData: any): Observable<any> {
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity/${id}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.patch(url, updatedData, { headers });
    }
    
    fetchAllTypes(): Observable<any> {
        return new Observable((observer) => {
            this.http.get<any>(this.apiUrlgetdates).subscribe(
                (response) => {
                    if (response && response.data) {
                        this.typesData = response.data; 
                        this.isDataLoaded.next(true); 
                    } else {
                    }
                    observer.next(response);
                    observer.complete();
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }

    getTypeByKey(key: string): any[] {
        return this.typesData[key] || [];
    }

    fetchEntities(query: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = query ? { search: query } : {};
        return this.http.get<any>(this.apiUrlEntities, { headers, params });
    }
}
