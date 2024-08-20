import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  createRoom(gameName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.socket.emit('createRoom', { gameName });
        this.socket.once('gameCreated', (data: any) => resolve(data));
        this.socket.once('error', (data: any) => reject(data));
    });
  }
}
