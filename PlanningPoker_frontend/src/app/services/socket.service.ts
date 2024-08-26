import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  joinRoom(roomId: string, playerInfo: any){
    this.socket.emit('joinRoom', roomId, playerInfo);
  }

  onPlayerJoin(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('joinedRoom', (players) => {
        observer.next(players);
      });
    });
  }

  onSelectCard(gameId: string, player: any): Observable<any> { 
    this.socket.emit("selectCard", gameId, player)
    return new Observable((observer) => {
      this.socket.on('selectedCard', (data) => {
        observer.next(data);
      });
    });
  }
}
