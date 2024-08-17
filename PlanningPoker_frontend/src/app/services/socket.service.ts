import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;

  constructor() {
  }

  startConnection() {
    if (!this.socket) {
      this.socket = io('http://localhost:3000'); // Cambia la URL a la de tu servidor
      console.log('Socket connected:', this.socket);
    }
  }

  createRoom(gameName: string) {
    if (this.socket) {
      this.socket.emit('createRoom', gameName);
      this.socket.on("gameCreated", (data: any) => {
        console.log("RoomID: ", data.gameId)
      })
    }
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', roomId);
    }
  }

  onNewVote(callback: (vote: any) => void) {
    if (this.socket) {
      this.socket.on('newVote', callback);
    }
  }

  sendVote(vote: any) {
    if (this.socket) {
      this.socket.emit('vote', vote);
    }
  }
}
