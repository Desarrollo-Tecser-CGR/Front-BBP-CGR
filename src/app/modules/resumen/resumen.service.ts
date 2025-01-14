import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { CONFIG } from '../../config/config';
import registerUsersRoutes from '../auth/register-users/register-users.routes';

@Injectable({
    providedIn: 'root',
})
export class ResumenService {
    private apiUrl = `${CONFIG.apiHost}/api/v1/hojadevida/guardar`;
    private uploadUrl = `${CONFIG.apiHost}/api/v1/hojadevida/cargar-archivo`;
    private apiUrlGet = `${CONFIG.apiHost}/api/v1/hojadevida/getIdentity`;
    private apiUrlUpdate = `${CONFIG.apiHost}/api/v1/updateIdentity`;
    private apiUrlSetValidateStatus = `${CONFIG.apiHost}/api/v1/hojadevida/updateIdentity`;
    private apiUrlgetdates = `${CONFIG.apiHost}/api/v1/hojadevida/getAllTypes`;

    // Propiedades para almacenar datos compartidos
    private typesData: { [key: string]: any[] } = {};
    public typeStrategyIdentifications: any[] = [];
    public isDataLoaded: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {}

    sendFormDataAsJson(formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.apiUrl, formData, { headers }).pipe(
            map((response: any)=>{
                console.log('Data:', response);
                const id = response.data.id;
                console.log('Id hv:', id);
                return response;
            }),
            catchError((e)=>{
                console.error('Error al obtener los datos:', e);
                return throwError(e);
            }),
            );
    }

    

    uploadFile(identityId: number, fileData: FormData): Observable<any> {
        console.log('Id pasando al servicio de carga', identityId)
        return this.http.post(this.uploadUrl+`?identityId=${identityId}` , fileData);
    }

    getDataAsJson(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrlGet + '/' + id);
    }

    updateDataAsJson(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${CONFIG.apiHost}/api/v1/hojadevida/updateIdentity/${id}`;
        return this.http.patch(url, formData, { headers }); 
    }    

    updateStateWithPatch(id: number, updatedData: any): Observable<any> {
        const url = `${CONFIG.apiHost}/api/v1/hojadevida/updateIdentity/${id}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.patch(url, updatedData, { headers });
    }
    

    fetchAllTypes(): Observable<any> {
        return new Observable((observer) => {
            this.http.get<any>(this.apiUrlgetdates).subscribe(
                (response) => {
                    if (response && response.data) {
                        this.typesData = response.data; 
                        console.log(
                            'Datos cargados del servicio:',
                            this.typesData
                        ); 
                        this.isDataLoaded.next(true); 
                    } else {
                        console.error(
                            'No se encontró el campo data en la respuesta.'
                        );
                    }
                    observer.next(response);
                    observer.complete();
                },
                (error) => {
                    console.error('Error al obtener los datos:', error);
                    observer.error(error);
                }
            );
        });
    }

    getTypeByKey(key: string): any[] {
        return this.typesData[key] || [];
    }
}
