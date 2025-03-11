import { Notification } from './notifications.types'; 
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule, DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { WebSocketNotificationService } from './webSocketNotification.service';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications',
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        NgClass,
        NgTemplateOutlet,
        RouterLink,
        DatePipe,
    ],
})
export class NotificationsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel')
    private _notificationsPanel: TemplateRef<any>;
    roles: string;
    rol: string;
    notifications: any[]= [];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
 
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _webSocketService: WebSocketNotificationService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * On init
     */
    ngOnInit(): void {
        this.roles = JSON.parse(localStorage.getItem('accessRoles'));
        this.rol = this.roles[0];
        this._notificationsService._notifications.asObservable();

        if (this.rol === 'validador') {
            forkJoin([
                this._notificationsService.getByType(1),
                this._notificationsService.getByType(2),
                this._notificationsService.getByType(6)
            ]).subscribe(
                ([registerNotifications, validationNotifications, caracterizationNotifications])=>{
                    const response = [
                        ...registerNotifications,
                        ...validationNotifications,
                        ...caracterizationNotifications
                    ];

                    this._notificationsService._notifications.next(response);
                    this.notifications = response;

                    this._calculateUnreadCount();
                    this._changeDetectorRef.markForCheck();
                },
                (error) =>{
                    console.error('Error al obtener las notificaciones:',error);
                    
                }
            )
        } 
        if (this.rol === 'caracterizador') {
            this._notificationsService.getByType(3).subscribe(
                (data) =>{
                    this._notificationsService._notifications.next(data);
                    this.notifications= data;

                    this._calculateUnreadCount();
                    this._changeDetectorRef.markForCheck();
                },
                (error)=>{
                }
            );
        };
    }
 
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    /**
     * Inicializa las notificaciones según el rol del usuario
     */
    private _initializeNotifications(): void {
        const roles: string[] = JSON.parse(localStorage.getItem('accessRoles') || '[]');
        const userRole = roles[0] || '';

        const roleNotificationMap: { [key: string]: number[] } = {
            validador: [1, 2, 6],
            caracterizador: [3],
            evaluador: [7],
        };

        const notificationTypes = roleNotificationMap[userRole];

        if (!notificationTypes) {
            console.warn(`Rol no reconocido: ${userRole}`);
            return;
        }

        forkJoin(notificationTypes.map((type) => this._notificationsService.getByType(type)))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (responses) => {
                    this.notifications = responses.flat();
                    this._calculateUnreadCount();
                    this._changeDetectorRef.markForCheck();
                },
                (error) => console.error('Error al obtener las notificaciones:', error)
            );
    }

    /**
     * Suscribirse a notificaciones en tiempo real con WebSockets
     */
    private _subscribeToWebSocketNotifications(): void {
        this._webSocketService.notification$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((message) => {
                if (message) {
                    try {
                        console.log('Este es el mensaje: ', message);
                        const notification = JSON.parse(message);
                        console.log(notification);
                        this.notifications.unshift(notification);
                        this._calculateUnreadCount();
                        this._changeDetectorRef.markForCheck();
                    } catch (error) {
                        console.error('Error al procesar la notificación WebSocket:', error);
                    }
                }
            });
    }

    formatMessage(message: string): string {
        // Expresión regular para encontrar el usuario (palabra después de "El usuario ")
        const userRegex = /El usuario (\S+)/;
        // Expresión regular para encontrar el ID (después de "# ")
        const idRegex = /# (\d+)/;
    
        // Reemplazar el usuario con negrita
        message = message.replace(userRegex, (match, user) => `El usuario <strong>${user}</strong>`);
    
        // Reemplazar el ID con negrita
        message = message.replace(idRegex, (match, id) => `# <strong>${id}</strong>`);
    
        return message;
    }

    /**
     * Abre el panel de notificaciones
     */
    openPanel(): void {
        if (!this._notificationsPanel || !this._notificationsOrigin) return;
        if (!this._overlayRef) this._createOverlay();
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Cierra el panel de notificaciones
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    markAllAsRead(): void {
        this.notifications.forEach((notification) => (notification.readOnly = true));
        this.unreadCount = 0;
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Alternar el estado de lectura de una notificación
     */
    toggleRead(notification: Notification): void {
        notification.readOnly = !notification.readOnly;
        this._calculateUnreadCount();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Elimina una notificación
     */
    delete(id: string): void {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this._calculateUnreadCount();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Calcula el número de notificaciones no leídas
     */
    private _calculateUnreadCount(): void {
        this.unreadCount = this.notifications.filter((n) => !n.readOnly).length;
    }

    trackByFn(index: number, item: Notification): string {
        return item.id; // Usa un identificador único de la notificación
    }

    /**
     * Crea el overlay del panel de notificaciones
     */

    private capitalizeFirstLetter(value: string): string {
        return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
    }
    
    private _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
                    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
                    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
                    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
                ]),
        });

        this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
    }
}
