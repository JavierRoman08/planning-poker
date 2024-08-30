import { Player } from '@/models/player';
import { SocketService } from '@/services/socket.service';
import { ToastService } from '@/services/toast.service';
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
  gameName: string = "";
  player: Player = new Player();
  playerList: Player[] = [];
  cards: number[] = [];
  votes: any[] = [];
  isNewPlayer: boolean = false;
  errorPlayerMessage: string | null = null;
  registeredPlayer: Player = new Player();
  selectedCardValue: number | undefined;
  positions: { top: string, left: string }[] = [];
  showCards: boolean = false;
  showInviteModal: boolean = false;
  average: number = 0;
  isChangingAdmin = false;

  constructor(private route: ActivatedRoute, private socketService: SocketService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId') ?? ""; 

    this.socketService.onPlayerJoin().subscribe(data => {
      this.playerList = data.players
      this.toastService.showToast(data.alert, 3000)
      this.gameName = data.gameName
    })

    this.socketService.onCardVisibilityChange((data: { showCard: boolean, average: number, cardValue: any }) => {
      this.showCards = data.showCard;
      this.average = data.average
      this.selectedCardValue = data.cardValue
    });

    this.socketService.onResetGame().subscribe(data => {
      this.cards = data.cards
      this.votes = data.votes
    })

    this.socketService.onSelectCard().subscribe(data => {
        this.votes = data.votes
        this.toastService.showToast(data.message, 3000);
    })

    this.socketService.onRoleChanged().subscribe(data => {
      this.toastService.showToast(`${data.player.nickname} has changed role to ${data.player.role}`)
    })

    this.socketService.onChangedAdmin().subscribe(data => {
      this.toastService.showToast(`${data.player.nickname} is now an Admin`, 3000)
      this.playerList = data.players
      if(data.player.playerId == this.registeredPlayer.playerId) {
        this.registeredPlayer = data.player
        this.toastService.showToast(`You are now an Admin`, 5000)
      }
    })

    this.socketService.getCardPool().subscribe(data => {this.cards = data.cards})
    this.socketService.getVotes().subscribe(data => {this.votes = data.votes})
  }

  ngDoCheck(): void {
    this.calculatePositions(); // Recalcular posiciones cada vez que haya cambios en el array
  }

  startNewGame() {
    if(this.registeredPlayer.isAdmin) {
      this.showCards = false
      this.average = 0
      this.selectedCardValue = undefined; 
      this.socketService.resetGame(this.gameId);
      this.socketService.broadcastCardVisibility(this.showCards, this.average, this.selectedCardValue);
    } else {
      this.toastService.showToast("No puedes hacer esto", 3000)
    }
  }

  createPlayer(form?: NgForm) {
    const validation = validateGameName(form?.value.nickname);
    if (validation.isValid) {
        const player = form?.value
        this.isNewPlayer = true;
        this.socketService.joinRoom(this.gameId, player).then(data => {
          this.registeredPlayer = data.player
        })
    } else {
      this.errorPlayerMessage = validation.errorMessage
    }

  }

  selectCard(value: number) {
    if(this.selectedCardValue) {
      this.toastService.showToast("No puedes cambiar de carta", 3000)
    } else {
      this.selectedCardValue = value
      this.socketService.selectCard(this.gameId, this.registeredPlayer, this.selectedCardValue)
    }
  }

  onShowCards() {
    if(this.registeredPlayer.isAdmin) {
      const votes = this.votes.map(item => item.voteValue);
      const totalSum = votes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      this.showCards = !this.showCards;
      this.average = totalSum / votes.length
      this.socketService.broadcastCardVisibility(this.showCards, this.average);
    } else {
      this.toastService.showToast("No puedes hacer esto", 3000)
    }
  }

  checkVote(playerNickName: string): boolean {
    return this.votes.some(item => item.player.nickname == playerNickName)
  }

  getVoteValue(playerNickName: string): number | undefined {
    const vote = this.votes.find(vote => vote.player.nickname === playerNickName).voteValue
    return vote;
  }

  changeRole(){
    if(this.registeredPlayer.role == "player"){
      this.registeredPlayer.role = "spectator";
    } else if(this.registeredPlayer.role == "spectator"){
      this.registeredPlayer.role = "player";
    }

    this.socketService.changeRole(this.gameId, this.registeredPlayer.role)
  }

  selectNewAdmin(){
    this.isChangingAdmin = !this.isChangingAdmin
  }

  makeAdmin(player: any){
    if(player.isAdmin){
      this.toastService.showToast(`${player.nickname} is already and admin`, 3000)
    } else {
      this.socketService.selectAdmin(this.gameId, player)
    }

    this.isChangingAdmin = !this.isChangingAdmin
  }

  onShowModal(){
    this.showInviteModal = !this.showInviteModal
  }

  countVotes() {
    const conteo = this.votes.reduce((acc, obj) => {
      acc[obj.voteValue] = (acc[obj.voteValue] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    const resultado = Object.keys(conteo).map(key => {
      return { numberValue: parseInt(key), count: conteo[key] };
    });

    return resultado;
  }

  calculatePositions(): void {
    const ellipseWidth = 770; // Ancho del eje mayor (horizontal)
    const ellipseHeight = 570; // Altura del eje menor (vertical)
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
