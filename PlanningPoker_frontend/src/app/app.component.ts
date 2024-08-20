import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PlanningPoker';
  gameName: string = "";
  gameId: string | undefined;
  errorMessage: string | null = null;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void { /* TODO document why this method 'ngOnInit' is empty */ }

  validateGameName(gameName: string): boolean {
    const hasInvalidChars = /[_.#,*\\/-]/.test(gameName);
    const isOnlyNumbers = /^\d+$/.test(gameName);
    const hasMoreThanThreeNumbers = (gameName.match(/\d/g) || []).length > 3;
    const isLengthValid = gameName.length >= 5 && gameName.length <= 20;

    if (hasInvalidChars) {
      this.errorMessage = "El nombre no puede contener caracteres especiales.";
      return false;
    }
    if (isOnlyNumbers) {
      this.errorMessage = "El nombre no puede estar compuesto solo por números.";
      return false;
    }
    if (hasMoreThanThreeNumbers) {
      this.errorMessage = "El nombre no puede tener más de 3 números.";
      return false;
    }
    if (!isLengthValid) {
      this.errorMessage = "El nombre debe tener entre 5 y 20 caracteres.";
      return false;
    }

    this.errorMessage = null;
    return true;
  }

  createRoom(form?: NgForm) {
    if (this.validateGameName(form?.value.gameName)) {
      this.socketService.createRoom(this.gameName).then((data) => {
        this.gameId = data.gameId;
        form?.reset();
      });
    }
  }
}
