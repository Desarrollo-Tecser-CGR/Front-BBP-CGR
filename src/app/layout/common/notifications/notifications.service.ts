import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { BehaviorSubject, map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class NotificationsService {
 
    private _notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
 
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
    getAll(): Observable<Notification[]> {
        return this._httpClient
            .get<Notification[]>('api/common/notifications')
            .pipe(
                tap((notifications) => {
                    this._notifications.next(notifications);
                })
            );
    }
 
    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap((notifications) =>
                this._httpClient
                    .post<Notification>('api/common/notifications', {
                        notification,
                    })
                    .pipe(
                        map((newNotification) => {
                            // Update the notifications with the new notification
                            this._notifications.next([
                                ...notifications,
                                newNotification,
                            ]);
 
                            // Return the new notification from observable
                            return newNotification;
                        })
                    )
            )
        );
    }
 
    /**
     * Update the notification
     *
     */
    update(id: string, updatedNotification: Notification): Observable<void> {
        const currentNotifications = this._notifications.getValue();
        const index = currentNotifications.findIndex((n) => n.id === id);
        if (index !== -1) {
            currentNotifications[index] = updatedNotification;
            this._notifications.next(currentNotifications);
        }
        return new Observable((observer) => {
            observer.next();
            observer.complete();
        });
    }
 
    /**
     * Delete the notification
     *
     */
    delete(id: string): Observable<void> {
        const currentNotifications = this._notifications.getValue();
        this._notifications.next(currentNotifications.filter((n) => n.id !== id));
        return new Observable((observer) => {
            observer.next();
            observer.complete();
        });
    }
 
    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<void> {
        const currentNotifications = this._notifications.getValue();
        currentNotifications.forEach((notification) => (notification.read = true));
        this._notifications.next(currentNotifications);
        return new Observable((observer) => {
            observer.next();
            observer.complete();
        });
    }
 
 
    /**
     * METODO PARA UTILIZAR LAS NOTIFICACIONES EN UN SISTEMA
     */
    add(notification: Notification): Observable<void> {
        notification.expanded = false;
        const currentNotifications = this._notifications.getValue();
        this._notifications.next([...currentNotifications, notification]);
        return new Observable((observer) => {
            observer.next();
            observer.complete();
        });
    }
}