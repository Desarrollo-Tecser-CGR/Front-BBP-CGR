import { over } from 'lodash';
// notifications.service.ts

import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketNotificationService {
  private socket: any;
  private stompClient: any;
  private notificationSubscription: any;
  private reconnectDelay: number = 5000;

   constructor() {
    this.connect();
  }

  private connect(): void {
    // Inicializa la conexión con SockJS
    const token =`${this.getToken()}`;
    this.socket = new SockJS(`http://localhost:5500/ws`);

    this.stompClient = Stomp.over(this.socket);

    // Opcional: desactivar logs de debug si se desea
    this.stompClient.debug = () => {};

    // Conecta al servidor con callbacks de conexión y error
    this.stompClient.connect(
      // { 'Authorization': `Bearer ${token}` },
      (frame: any) => {
        console.log('Connected:', frame);
        this.subscribeToNotifications();
        this.reconnectDelay;
      },
      (error: any) => {
        console.error('STOMP error:', error);
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect();
          
        }, this.reconnectDelay);
        // Aquí podrías implementar una lógica de reconexión si es necesario
      }
    );
  }

  private subscribeToNotifications(): void {
    // Se suscribe al tópico de notificaciones y guarda la suscripción para poder cancelar luego
    this.notificationSubscription = this.stompClient.subscribe('/topic/notifications', (message: any) => {
      console.log('New notification:', message.body);
      // Procesa el mensaje recibido según la lógica de tu aplicación
    });
  }

  // public disconnect(): void {
  //   // Cancela la suscripción si existe
  //   if (this.notificationSubscription) {
  //     this.notificationSubscription.unsubscribe();
  //     console.log('Unsubscribed from notifications.');
  //   }
  //   // Desconecta el cliente STOMP si está conectado
  //   if (this.stompClient) {
  //     this.stompClient.disconnect(() => {
  //       console.log('Disconnected from WebSocket.');
  //     });
  //   }
  // }

  // // Configura la conexión RxStomp con el token en la URL
  // private configure(): void {
  //   const token = this.getToken();
  //   // Construir el token con el prefijo Bearer y codificarlo para la URL
  //   const bearerToken = encodeURIComponent(`Bearer${token}`);
  //   const config: RxStompConfig = {
  //     brokerURL: `https://localhost:5500/ws`,
  //   //   connectHeaders: {
  //   //     Authorization: bearerToken
  //   //   },
  //     heartbeatIncoming: 0,
  //     heartbeatOutgoing: 20000,
  //     reconnectDelay: 5000,
  //     debug: (msg: string): void => {
  //       console.log(new Date(), msg);
  //     }
  //   };
  //   this.rxStomp.configure(config);
  // }

  // // Activa la conexión y escucha el estado de conexión
  // private activate(): void {
  //   this.rxStomp.activate();
  //   this.rxStomp.connected$.subscribe(connected => {
  //     console.log('WebSocket connected: ', connected ? 'Conectado' : 'Desconectado');
  //   });
  // }

  // Obtiene el token desde localStorage o algún servicio de autenticación
  private getToken(): string {
    const token = localStorage.getItem('accessToken') || '';
    console.log('Token obtenido:', token);
    return token;
  }

  // // Método para suscribirse a notificaciones globales a través de STOMP
  // public getGlobalNotifications(): Observable<string> {
  //   return this.rxStomp.watch('/topic/notifications').pipe(
  //     map(message => message.body)
  //   );
  // }
}
