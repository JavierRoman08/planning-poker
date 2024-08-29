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

  getCardPool(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getCardPool', (cards) => {
        observer.next(cards);
      });
    });
  }

  joinRoom(roomId: string, playerInfo: any): Promise<any> {
    this.socket.emit('joinRoom', roomId, playerInfo);
    return new Promise((resolve, reject) => {
      this.socket.once('getPlayerInfo', (data: any) => resolve(data))
    })
  }

  onPlayerJoin(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('joinedRoom', (players) => {
        observer.next(players);
      });
    });
  }

  selectCard(gameId: string, player: any, voteValue: any) { 
    this.socket.emit("selectCard", gameId, player, voteValue)
  }

  onSelectCard(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('selectedCard', (data) => {
        observer.next(data);
      });
    });
  }


  broadcastCardVisibility(showCard: boolean, average: number, cardValue?: number): void {
    this.socket.emit('cardVisibility', { showCard, average, cardValue });
  }

  onCardVisibilityChange(callback: (data: { showCard: boolean, average: number, cardValue: any }) => void): void {
    this.socket.on('cardVisibility', callback);
  }

  getVotes(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getVotes', (votes) => {
        observer.next(votes);
      });
    });
  }

  resetGame(gameId: string) {
    this.socket.emit("resetGame", gameId)
  }

  onResetGame(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('gameReseted', (data) => {
        observer.next(data);
      });
    });
  }
}
