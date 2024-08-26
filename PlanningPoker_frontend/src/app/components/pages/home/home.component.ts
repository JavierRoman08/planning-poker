import { Player } from '@/models/player';
import { SocketService } from '@/services/socket.service';
import validateGameName from '@/utils/validateName';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gameName: string = "";
  gameId: string = "";
  errorMessage: string | null = null;
  isAdmin: boolean = false;
  registeredPlayer: Player = new Player();

  constructor(private socketService: SocketService, private router: Router) {}

  createRoom(form?: NgForm) {
    const validation = validateGameName(form?.value.gameName);
    if (validation.isValid) {
      this.socketService.createRoom(this.gameName).then((data) => {
        this.gameId = data.gameId;
        this.isAdmin = true;
        this.router.navigate([`/game`, data.gameId]);
      });
    } else {
      this.errorMessage = validation.errorMessage
    }
  }
}
