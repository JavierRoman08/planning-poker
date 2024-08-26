import { Player } from '@/models/player';
import { SocketService } from '@/services/socket.service';
import validateGameName from '@/utils/validateName';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  gameId: string = "";
  player: Player = new Player();
  playerList: Player[] = [];
  cards: number[] = [3, 5, 10, 30, 21, 7]
  isNewPlayer: boolean = false;
  isAdmin: boolean = false;
  errorPlayerMessage: string | null = null;
  registeredPlayer: Player = new Player();
  selectedCardValue: number | undefined;
  positions: { top: string, left: string }[] = [];

  constructor(private route: ActivatedRoute, private socket: SocketService) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId') ?? "";
    this.socket.onPlayerJoin().subscribe(data => {
      this.playerList = data.players
    })
  }

  ngDoCheck(): void {
    this.calculatePositions(); // Recalcular posiciones cada vez que haya cambios en el array
  }

  createPlayer(form?: NgForm) {
    const validation = validateGameName(form?.value.nickname);
    if (validation.isValid) {
        const newPlayer = {...form?.value, isAdmin: this.isAdmin}
        this.isNewPlayer = true;
        this.registeredPlayer = newPlayer
        this.socket.joinRoom(this.gameId, newPlayer)
        
    } else {
      this.errorPlayerMessage = validation.errorMessage
    }

    this.player = new Player()
  }

  handleClick(value: number) {
    this.selectedCardValue = value
  }

  calculatePositions(): void {
    const ellipseWidth = 750; // Ancho del eje mayor (horizontal)
    const ellipseHeight = 550; // Altura del eje menor (vertical)
    const centerX = ellipseWidth / 2;
    const centerY = ellipseHeight / 2;
    const angleStep = (2 * Math.PI) / this.playerList.length;

    this.positions = this.playerList.map((_, index) => {
      const angle = index * angleStep;
      const top = centerY + (ellipseHeight / 2) * Math.sin(angle) - 25;
      const left = centerX + (ellipseWidth / 2) * Math.cos(angle) - 25;
      return { top: `${top}px`, left: `${left}px` };
    });
  }
}
