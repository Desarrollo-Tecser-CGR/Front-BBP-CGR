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
import { Subject, takeUntil, filter, forkJoin, catchError } from 'rxjs';
 
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
    user: User | null = null;
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
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {
        console.log('Valor de user antes del render:', this.user);
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * On init
     */
    ngOnInit(): void {
        const roles = localStorage.getItem('accessRoles');
        const cargo = roles ? this.capitalizeFirstLetter(JSON.parse(roles)[0]) : 'Rol';
        this.user = { cargo };

        console.log('Cargo del usuario:', this.user.cargo);

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
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
 
        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }
 
        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }
 
        // Attach the portal to the overlay
        this._overlayRef.attach(
            new TemplatePortal(this._notificationsPanel, this._viewContainerRef)
        );
    }
 
    /**
     * Close the notifications panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }
 
    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this._notificationsService.markAllAsRead().subscribe();
    }
 
    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notification): void {
        // Toggle the read status
        notification.readOnly = !notification.readOnly;
 
        // Update the notification
        this._notificationsService
            .update(notification.id)
            .subscribe();
    }
 
    toggleExpand(notification: Notification): void {
        notification.expanded = !notification.expanded;
        this._notificationsService.update(notification.id).subscribe();
    }
   
    /**
     * Delete the given notification
     */
    delete(id:string): void {
        // Delete the notification
        this._notificationsService.deleteNotification(id).subscribe({
            
        });
    }
 
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * Create the overlay
     */

    private capitalizeFirstLetter(value: string): string {
        return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
    }
    
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(
                    this._notificationsOrigin._elementRef.nativeElement
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });
 
        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
 
    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;
 
        if (this.notifications && this.notifications.length) {
            count =this.notifications.filter(
                (notification) => !notification.readOnly).length;
        }
 
        this.unreadCount = count;
    }
}