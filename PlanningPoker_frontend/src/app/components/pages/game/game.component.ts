import { Player } from '@/models/player';
import { SessionStorageService } from '@/services/sessionstorage.service';
import { SocketService } from '@/services/socket.service';
import { ToastService } from '@/services/toast.service';
import validateGameName from '@/utils/validateName';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  gameId: string = '';
  gameName: string = '';
  player: Player = new Player();
  playerList: Player[] = [];
  cards: number[] = [0,1,1,2,3,5,8,13,21,34,55,89];
  votes: any[] = [];
  errorPlayerMessage: string | null = null;
  registeredPlayer: Player = new Player();
  selectedCardValue: number | undefined;
  positions: { top: string; left: string }[] = [];
  showCards: boolean = false;
  showInviteModal: boolean = false;
  average: number = 0;
  isChangingAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private toastService: ToastService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.registeredPlayer = this.sessionStorageService.getItem('player');
    this.gameName = this.sessionStorageService.getItem('gameName');

    if (!this.registeredPlayer) {
      this.registeredPlayer = new Player(); // Valor por defecto
    }

    this.gameId = this.route.snapshot.paramMap.get('gameId') ?? '';

    this.socketService.onPlayerJoin().subscribe((data) => {
      this.playerList = data.players;
      this.toastService.showToast(data.alert, 3000);
      this.gameName = data.gameName;
      this.sessionStorageService.saveItem('gameName', this.gameName)
    });

    this.socketService.onCardVisibilityChange(
      (data: { showCard: boolean; average: number; cardValue: any }) => {
        this.showCards = data.showCard;
        this.average = data.average;
        this.selectedCardValue = data.cardValue;
      }
    );

    this.socketService.onResetGame().subscribe((data) => {
      this.votes = data.votes;
    });

    this.socketService.onSelectCard().subscribe((data) => {
      this.votes = data.votes;
      this.toastService.showToast(data.message, 3000);
    });

    this.socketService.onRoleChanged().subscribe((data) => {
      this.toastService.showToast(
        `${data.player.nickname} has changed role to ${data.player.role}`
      );
    });

    this.socketService.onChangedAdmin().subscribe((data) => {
      this.toastService.showToast(
        `${data.player.nickname} is now an Admin`,
        3000
      );
      this.playerList = data.players;
      if (data.player.playerId == this.registeredPlayer.playerId) {
        this.registeredPlayer = data.player;
        this.toastService.showToast(`You are now an Admin`, 5000);
      }
    });

    this.socketService.getVotes().subscribe((data) => {
      this.votes = data.votes;
    });

    this.socketService.onUserDisconnect().subscribe((data) => {
      this.playerList = data.players; // Actualiza la lista de jugadores en la UI
    });
  }

  ngOnDestroy() {
    this.sessionStorageService.clearAll();
  }

  startNewGame() {
    if (this.registeredPlayer.isAdmin) {
      this.showCards = false;
      this.average = 0;
      this.selectedCardValue = undefined;
      this.socketService.resetGame(this.gameId);
      this.socketService.broadcastCardVisibility(
        this.showCards,
        this.average,
        this.selectedCardValue
      );
    } else {
      this.toastService.showToast('No puedes hacer esto', 3000);
    }
  }

  createPlayer(form?: NgForm) {
    const validation = validateGameName(form?.value.nickname);
    if (validation.isValid) {
      const player = form?.value;
      this.socketService.joinRoom(this.gameId, player).then((data) => {
        this.registeredPlayer = data.player;
        this.sessionStorageService.saveItem('player', data.player);
      });
    } else {
      this.errorPlayerMessage = validation.errorMessage;
    }
  }

  selectCard(value: number) {
    if (this.selectedCardValue) {
      this.toastService.showToast('No puedes cambiar de carta', 3000);
    } else {
      this.selectedCardValue = value;
      this.socketService.selectCard(
        this.gameId,
        this.registeredPlayer,
        this.selectedCardValue
      );
    }
  }

  onShowCards() {
    if (this.registeredPlayer.isAdmin) {
      const votes = this.votes.map((item) => item.voteValue);
      const totalSum = votes.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      this.showCards = !this.showCards;
      this.average = totalSum / votes.length;
      this.socketService.broadcastCardVisibility(this.showCards, this.average);
    } else {
      this.toastService.showToast('No puedes hacer esto', 3000);
    }
  }

  checkVote(playerNickName: string): boolean {
    return this.votes.some((item) => item.player.nickname == playerNickName);
  }

  getVoteValue(playerNickName: string): number | undefined {
    const vote = this.votes.find(
      (vote) => vote.player.nickname === playerNickName
    ).voteValue;
    return vote;
  }

  changeRole() {
    if (this.registeredPlayer.role == 'player') {
      this.registeredPlayer.role = 'spectator';
    } else if (this.registeredPlayer.role == 'spectator') {
      this.registeredPlayer.role = 'player';
    }

    this.socketService.changeRole(this.gameId, this.registeredPlayer.role);
  }

  selectNewAdmin() {
    this.isChangingAdmin = !this.isChangingAdmin;
  }

  makeAdmin(player: any) {
    this.socketService.selectAdmin(this.gameId, player);
    this.isChangingAdmin = !this.isChangingAdmin;
  }

  onShowModal() {
    this.showInviteModal = !this.showInviteModal;
  }

  countVotes() {
    const conteo = this.votes.reduce((acc, obj) => {
      acc[obj.voteValue] = (acc[obj.voteValue] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    const resultado = Object.keys(conteo).map((key) => {
      return { numberValue: parseInt(key), count: conteo[key] };
    });

    return resultado;
  }

  getPlayerPositionStyle(index: number, totalPlayers: number) {
    const angle = (360 / totalPlayers) * index;
    const radiusX = 60; // Porcentaje del ancho de la mesa (ajustado para que sobresalgan)
    const radiusY = 50; // Porcentaje de la altura de la mesa (ajustado para que sobresalgan)

    return {
      left: `${50 + radiusX * Math.cos((angle * Math.PI) / 180)}%`,
      top: `${50 + radiusY * Math.sin((angle * Math.PI) / 180)}%`,
    };
  }
}
