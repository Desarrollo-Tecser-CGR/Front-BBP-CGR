import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { CONFIG } from '../../config/config';
import registerUsersRoutes from '../auth/register-users/register-users.routes';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';


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
    private apiUrlEntities = `${CONFIG.apiHost}/api/v1/entityCgr/getAllEntities`;

    // Propiedades para almacenar datos compartidos
    private typesData: { [key: string]: any[] } = {};
    public typeStrategyIdentifications: any[] = [];
    public isDataLoaded: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient,
        private notificationsService: NotificationsService,
    ) {}

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log('Formatted Date:', formattedDate); 
        return formattedDate;
    }

    enviarNotificacion(resumeId: number, user:string): void {
        const mensaje = `El usuario ${user} ha generado un nuevo registro de hoja de vida # ${resumeId}`;
        const nuevaNotificacion: Notification = {
            icon: "heroicons_outline:document-check",
            title: `Nuevo registro Hoja de vida # ${resumeId}`,
            description: mensaje,
            time: this.formatDate(new Date()),
            expanded:false,
            enabled:true,
            readOnly: false,
            sAMAccountName: user
        };
    this.notificationsService.add(nuevaNotificacion).subscribe(() => {
        console.log('Notificación enviada:', mensaje);
        });
    }

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

    fetchEntities(query: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = query ? { search: query } : {};
        return this.http.get<any>(this.apiUrlEntities, { headers, params });
    }
}
