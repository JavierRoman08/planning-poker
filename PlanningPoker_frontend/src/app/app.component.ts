import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { NgForm } from '@angular/forms';
import validateGameName from '@/utils/validateName';
import { Player } from './models/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PlanningPoker';
  gameName: string = "";
  player: Player = new Player();
  playerList: Player[] = [];
  isNewPlayer: boolean = false;
  gameId: string = "";
  errorMessage: string | null = null;
  errorPlayerMessage: string | null = null;

  constructor(private socketService: SocketService) {}

  createRoom(form?: NgForm) {
    const validation = validateGameName(form?.value.gameName);
    if (validation.isValid) {
      this.socketService.createRoom(this.gameName).then((data) => {
        this.gameId = data.gameId;
      });
    } else {
      this.errorMessage = validation.errorMessage
    }
  }

  createPlayer(form?: NgForm) {
    const validation = validateGameName(form?.value.nickname);
    if (validation.isValid) {
        const newPlayer = {...form?.value, isAdmin: true}
        this.isNewPlayer = true;

        this.socketService.joinRoom(this.gameId, newPlayer).then((data) => {
          this.playerList = data.players.filter((item: any) => item.role == 'player')
        });
    } else {
      this.errorPlayerMessage = validation.errorMessage
    }

    this.player = new Player()
  }
}
