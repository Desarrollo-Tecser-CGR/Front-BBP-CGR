import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from 'app/config/config';
import { Notification } from './notifications.types';
import { user } from 'app/mock-api/common/user/data';
import { BehaviorSubject, catchError, forkJoin, map, Observable, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private apiUrl = `${CONFIG.apiHost}/api/v1/notification`;
 
    public _notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
 
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * Get all notifications
     */
    
 
    /**
     * Create a notification
     */
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
        return this._httpClient.get(`${this.apiUrl}`).pipe(
            map((response:any)=>{
                const data = response.data;
                return data;
            }),
            catchError((e)=>{
                return throwError(e);
            })
        );
    }
    /**
     * Update the notification
     *
     */
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
        console.log(`${this.apiUrl}/edit/${id}`);
        return this._httpClient.patch<void>(`${this.apiUrl}/edit/${id}`,'').pipe(
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

    add(notification: any): Observable<void> {
        console.log('Notificación creada:', notification); // Verifica la notificación antes de agregarla
        notification.expanded = false;
        return this._httpClient.post<any>(this.apiUrl, notification).pipe(
            map((newNotification)=>{
                const currentNotifications = this._notifications.getValue();
                const updatedNotifications = [...currentNotifications, newNotification];

                this._notifications.next(updatedNotifications);
                console.log('Estado actual de notificaciones:', this._notifications.getValue()); // Revisa el estado actualizado

                this._saveNotifications(updatedNotifications);
            }),
            catchError((e)=>{
                console.error('Error al agregar la notificacion', e);
                return throwError(()=>e)
            })
        )

    };
}