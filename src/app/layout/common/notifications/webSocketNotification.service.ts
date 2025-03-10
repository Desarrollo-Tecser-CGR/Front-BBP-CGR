import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketNotificationService {
  private stompClient!: Client;
  private socketUrl = 'http://localhost:5500/ws';
  private reconnectDelay: number = 5000;
  private notificationSubscription!: StompSubscription | null;
  private isConnecting: boolean = false;

  // ✅ Subject para manejar notificaciones en tiempo real
  private notificationSubject = new BehaviorSubject<string | null>(null);

  // ✅ Observable que expone las notificaciones para los componentes
  public notification$: Observable<string | null> = this.notificationSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const token = this.getToken();
    console.log('Intentando conectar con el token:', token);

    if (!token) {
      console.error("❌ No se encontró un token válido.");
      return;
    }

    const socket = new SockJS(`http://localhost:5500/ws?token=${token}`); 

    this.stompClient = new Client({
      webSocketFactory: () => socket, 
      connectHeaders: {
        Authorization: `Bearer ${token}` // ✅ Se envía el token en los headers
      },
      debug: (str) => console.log('Debug STOMP:', str),
      reconnectDelay: this.reconnectDelay,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket conectado con éxito:', frame);
      this.isConnecting = false;
      this.subscribeToNotifications();
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('❌ Error en WebSocket:', error);
      this.isConnecting = false;
      this.handleReconnection();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Error en STOMP:', frame);
      this.isConnecting = false;
      this.handleReconnection();
    };

    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  // 🔄 Maneja la reconexión automática evitando múltiples intentos simultáneos
  private handleReconnection(): void {
    if (this.isConnecting) {
      console.log('Ya hay un intento de reconexión en curso.');
      return;
    }

    this.isConnecting = true;
    console.log(`🔄 Intentando reconectar en ${this.reconnectDelay / 1000} segundos...`);
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  // 🔔 Suscripción a notificaciones en WebSockets
  private subscribeToNotifications(): void {
    if (!this.stompClient || !this.stompClient.active) {
      console.warn('⚠️ No se puede suscribir porque WebSocket no está activo.');
      setTimeout(() => this.subscribeToNotifications(), 5000);
      return;
    }
  
    if (this.notificationSubscription) {
      console.log('🔄 Ya existe una suscripción activa. Cancelando la anterior.');
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
    }
  
    try {
      // ✅ Suscribirse al canal general `/topic/notifications`
      this.notificationSubscription = this.stompClient.subscribe(`/topic/notifications`, (message) => {
        try {
          console.log('📩 Mensaje recibido:', message.body);
          
          // 📜 Convertir el mensaje de JSON a objeto
          const parsedMessage = JSON.parse(message.body);
          console.log('📜 Mensaje decodificado:', parsedMessage);
  
          // 🔍 Filtrar la notificación según el usuario actual
          if (parsedMessage.user === this.getUser()) {
            console.log('✅ Notificación relevante para el usuario:', parsedMessage);
            this.notificationSubject.next(parsedMessage.message);
          } else {
            console.log('⚠️ Notificación para otro usuario, ignorando...');
          }
  
        } catch (error) {
          console.error('❌ Error al procesar el mensaje WebSocket:', error);
        }
      });
  
      console.log('✅ Suscripción WebSocket activa en /topic/notifications');
  
    } catch (error) {
      console.error('❌ Error al suscribirse a WebSocket:', error);
      setTimeout(() => this.subscribeToNotifications(), 5000);
    }
  }
  
  

  // 🔑 Obtiene el token desde localStorage
  private getToken(): string {
    const token = localStorage.getItem('accessToken') || '';
    console.log('🔑 Token obtenido:', token);
    return token;
  }

  // 🔑 Obtiene el token desde localStorage
  private getUser(): string {
    const user = localStorage.getItem('accessName') || '';
    console.log('🔑 Usuario obtenido:', user);
    return user;
  }
}
