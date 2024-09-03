import { of, Subject } from 'rxjs';

export class MockSocketService {
  private subject = new Subject<any>();

  createRoom(gameName: string): Promise<{gameId: string, gameName: string}> {
    return Promise.resolve({ gameId: '12345', gameName });
  }

  joinRoom(gameId: string, player: any): Promise<any> {
    return Promise.resolve({ playerInfo: {playerId: '123', ...player} });
  }

  onPlayerJoin() {
    return of({
      players: [{ playerId: '1', nickname: 'Player 1', role: 'player' }],
      alert: 'Player joined',
      gameName: 'Mock Game',
    });
  }

  selectCard(gameId: string, player: any, voteValue: any) {}
  onSelectCard() {
    return of({ votes: [], message: 'Card selected' });
  }

  changeRole(gameId: string, player: any) {}
  onRoleChanged() {
    return of({ player: { nickname: 'Test Player', role: 'admin' } });
  }

  broadcastCardVisibility(
    showCard: boolean,
    average: number,
    cardValue?: number
  ) {}

  onCardVisibilityChange(
    callback: (data: {
      showCard: boolean;
      average: number;
      cardValue: any;
    }) => void
  ) {
    callback({ showCard: true, average: 5, cardValue: 'Mock Card' });
  }

  getVotes() {
    return of({ votes: [] });
  }

  resetGame(gameId: string) {}
  onResetGame() {
    return of({ votes: [] });
  }

  selectAdmin(gameId: string, player: any) {}
  onChangedAdmin() {
    return of({
      player: { playerId: '1', nickname: 'Admin Player', role: 'player', isAdmin: true },
      players: [{ playerId: '2', nickname: 'Player 2', role: 'player', isAdmin: false }],
    });
  }

  selectGameMode(gameId: string, gameMode: string) {}
  onChangeGameMode() {
    return of({ gameMode: 'hours' });
  }
  onUserDisconnect() {
    return of({
      players: [{ playerId: '1', nickname: 'Player 1', role: 'player' }],
    });
  }
}
