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

  constructor(private route: ActivatedRoute, private socketService: SocketService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId') ?? ""; 

    this.socketService.onPlayerJoin().subscribe(data => {
      this.playerList = data.players
      this.toastService.showToast(data.alert, 3000)
    })

    this.socketService.getCardPool().subscribe(data => {this.cards = data.cards})

    this.socketService.getVotes().subscribe(data => {this.votes = data.votes})

    this.socketService.onCardVisibilityChange((data: { showCard: boolean }) => {
      this.showCards = data.showCard;
    });
  }

  ngDoCheck(): void {
    this.calculatePositions(); // Recalcular posiciones cada vez que haya cambios en el array
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
      this.socketService.onSelectCard(this.gameId, this.registeredPlayer, this.selectedCardValue).subscribe(data => {
        this.votes = data.votes
        this.toastService.showToast(data.message, 3000);
      })
    }
  }

  onShowCards() {
    if(this.registeredPlayer.isAdmin) {
      this.showCards = !this.showCards;
    this.socketService.broadcastCardVisibility(this.showCards);
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

  countVotes() {
    const voteCounts: { [key: number]: number } = {};

    this.votes.forEach(vote => {
      const value = vote.voteValue;
      if (voteCounts[value]) {
        voteCounts[value]++;
      } else {
        voteCounts[value] = 1;
      }
    });

    return voteCounts;
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
