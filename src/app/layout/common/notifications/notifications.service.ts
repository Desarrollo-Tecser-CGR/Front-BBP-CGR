import { Notification } from './notifications.types';
import { notifications } from './../../../mock-api/common/notifications/data';
import { ResumenService } from './../../../modules/resumen/resumen.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from 'app/config/config';
import { user } from 'app/mock-api/common/user/data';
import { BehaviorSubject, catchError, forkJoin, map, Observable, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private apiUrl = `${CONFIG.apiHost}/api/v1/notification`;
 
    public _notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    constructor(private _httpClient: HttpClient) { }

    /**
     * Getter for notifications
     */
    get notifications$(){
        return this._notifications.asObservable();
    }
    setNotifications(notification: Notification[]):void{
        this._notifications.next(notification);
    }

    create(notification: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._httpClient.post(this.apiUrl,notification ).pipe(
            map((response: any)=>{
                console.log('Data:', response);
                return response;
            }),
            catchError((e)=>{
                console.log('Error al obtener los datos:', e);
                 return throwError(e);
            })
        );
    }
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
    sendNotification(resumeId: number, user:string, typeId:number): void {
        let _title: String = '';
        switch (typeId) {
            case 1:
                _title = `Nuevo registro Hoja de vida # ${resumeId}`;
                break;
            case 2:
                _title = `Practica # ${resumeId} validada`;
                break;
            case 3:
                _title = `Nueva practica asignada # ${resumeId}`;
                break;
            case 4:
                _title = `Solicitud de apoyo en caracterización`;
                break;
            case 5:
                _title = `Solicitud de apoyo en evaluación`;
                break;
            case 6:
                _title = `Practica # ${resumeId} caracterizada`;
                break;
            case 7:
                _title = `Practica # ${resumeId} evaluada`;
                break;
            case 8:
                _title = `Respuesta a solicitud de apoyo`;
                break;
        
            default:
                break;
        }
        const mensaje = ``;
        const notification : Notification = {
            icon: "heroicons_outline:document-check",
            title: `${_title}`,
            description: mensaje,
            time: this.formatDate(new Date()),
            expanded: true,
            enabled: true,
            readOnly: false,
            sAMAccountName: user,
            notificationType: typeId,
        }
        const data = {
                ...notification,
                userDetails:{
                    sAMAccountName: user,
                    resumeId: resumeId
                    },
        };
        this.add(data).subscribe(() => {
        console.log('Notificación enviada:', data);
        });
    }
    
    getNotificationByUser(userName: any): Observable<any[]>{
        return this._httpClient.get(`${this.apiUrl}/${userName}`).pipe(
            map((response:any)=>{
                const data = response.data;
                return data;
            }),
            catchError((e)=>{
                return throwError(e);
            })
        );
    }
    getAll(): Observable<any[]>{
        return this._httpClient.get<Notification[]>(`${this.apiUrl}`).pipe(
            map((response:any)=>{
                const data = response.data;
                return data;
            }),
            catchError((e)=>{
                return throwError(e);
            })
        );
    }

    update(id: string): Observable<void> {
        const currentNotifications = this._notifications.getValue();
            const requests = currentNotifications.map((notification) =>
            this._httpClient.patch<void>(`${this.apiUrl}/editReadOnly/${id}`, '')
        );
    
        return forkJoin(requests).pipe(
            tap(() => {
                currentNotifications.forEach((notification) => (notification.readOnly = true));
                this._notifications.next(currentNotifications);
            }),
            map(() => undefined), 
            catchError((e) => {
                console.error('Error al marcar todas las notificaciones como leídas:', e);
                return throwError(() =>
                    new Error('No se pudieron marcar las notificaciones como leídas. Intente nuevamente más tarde.')
                );
            })
        );
    }
    /**
     * Delete the notification
     *
     */
    deleteNotification(id: string): Observable<void> {
        return this._httpClient.patch<void>(`${this.apiUrl}/edit/${id}`,'').pipe(
            map(()=>{
                const currentNotifications = this._notifications.getValue();
                console.log('Estado antes de eliminar:', currentNotifications);
                
                const updatedNotifications = currentNotifications.filter(
                    (_notification) => _notification.id !== id
                );

                this._notifications.next(updatedNotifications);
                console.log('Estado actual de notificaciones:', this._notifications.getValue());
            }),
            catchError((e)=>{
                console.error('No se pudo obtener la notificación', e);
                return throwError(()=> new Error('No se pudo obtener la notificación. Intente nuevamente más tarde.'))
            })
        );
    };
 
    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<void> {
        const currentNotifications = this._notifications.getValue();
        currentNotifications.forEach((notification) => (notification.readOnly = true));
        this._notifications.next(currentNotifications);
        return new Observable((observer) => {
            observer.next();
            observer.complete();
    })}
 
    /**
     * METODO PARA UTILIZAR LAS NOTIFICACIONES EN UN SISTEMA
     */
    private _saveNotifications(notifications: Notification[]): void {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    add(data: any): Observable<void> {
        console.log('Notificación creada:', data); // Verifica la notificación antes de agregarla
        return this._httpClient.post<any>(this.apiUrl, data).pipe(
            map((newNotification)=>{
                const currentNotifications = this._notifications.getValue();
                currentNotifications.push(newNotification);
                // const updatedNotifications = [...currentNotifications, newNotification];

                this._notifications.next(currentNotifications);
                console.log('Estado actual de notificaciones:', this._notifications.getValue()); // Revisa el estado actualizado

                this._saveNotifications(currentNotifications);
            }),
            catchError((e)=>{
                console.error('Error al agregar la notificacion', e);
                return throwError(()=>e)
            })
        )

    };
}