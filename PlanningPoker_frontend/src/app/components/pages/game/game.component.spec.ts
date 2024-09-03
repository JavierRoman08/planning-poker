import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from '@/components/molecules/navbar/navbar.component';
import { AvatarComponent } from '@/components/atoms/avatar/avatar.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorComponent } from '@/components/atoms/error/error.component';
import { ButtonComponent } from '@/components/atoms/button/button.component';
import { ToastComponent } from '@/components/atoms/toast/toast.component';
import { ToastService } from '@/services/toast.service';
import { Player } from '@/models/player';
import { SocketService } from '@/services/socket.service';
import { MockSocketService } from '@/utils/mockSocketService';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let toastService: ToastService;
  let mockSocketService: MockSocketService;

  beforeEach(async () => {
    mockSocketService = new MockSocketService();

    await TestBed.configureTestingModule({
      declarations: [GameComponent, NavbarComponent, AvatarComponent, ErrorComponent, ButtonComponent, ToastComponent],
      imports: [RouterModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute, ToastService, 
          useValue: {
            snapshot: { paramMap: { get: () => 'dddd' } },
            paramMap: of({ get: () => 'dddd' })
          }
        },
        { provide: SocketService, useValue: mockSocketService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    toastService = TestBed.inject(ToastService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea un nuevo jugador', fakeAsync(() => {
    const mockPlayerName = 'IamPlayer1'
    const mockGameId = 'mockGameID'

    component.gameId = mockGameId

    spyOn(mockSocketService, 'joinRoom').and.callThrough();

    const form = { value: {
      nickname: mockPlayerName,
      role: 'player',
      isAdmin: true
    }} as NgForm

    component.createPlayer(form)

    tick()

    expect(mockSocketService.joinRoom).toHaveBeenCalledWith(mockGameId, form.value)
    expect(component.errorPlayerMessage).toBeNull();
  }))

  
  it('error al crear nuevo jugador', fakeAsync(() => {
    const mockPlayerName = 'InvalidNickName_'
    const mockGameId = 'mockGameID'

    component.gameId = mockGameId

    spyOn(mockSocketService, 'joinRoom').and.callThrough();

    const form = { value: {
      nickname: mockPlayerName,
      role: 'player',
      isAdmin: true
    }} as NgForm

    component.createPlayer(form)

    tick()

    expect(mockSocketService.joinRoom).not.toHaveBeenCalled();
  }))

  it('seleccionar la carta', () => {
    const cardValue = 10
    component.selectCard(cardValue)
    expect(component.selectedCardValue).toBe(cardValue)
  })

  it('debe alternar el valor para mostrar el modal de los modos de juego', () => {
    component.changeGameMode = false

    component.onChangeGameMode()
    expect(component.changeGameMode).toBeTrue()
    
    component.onChangeGameMode()
    expect(component.changeGameMode).toBeFalse()
  })

  it('si se cambia el modo de juego', () => {
    const mockGameID = 'gameId1'
    component.gameId = mockGameID
    component.selectedGameMode = 'hours'

    spyOn(mockSocketService, 'selectGameMode')

    component.saveGameMode(component.selectedGameMode)

    expect(mockSocketService.selectGameMode).toHaveBeenCalledWith(mockGameID, component.selectedGameMode)
  })

  it('retorna verdadero si el jugador ya emitio un voto', () => {
    const playerNickName = 'player1';
    const mockVotes = [
      { player: { nickname: 'player1' } },
      { player: { nickname: 'player2' } }
    ];

    component.votes = mockVotes;
    const result = component.checkVote(playerNickName);

    expect(result).toBeTrue();
  });

  it('retorna falso si el jugador no ha votado', () => {
    const playerNickName = 'player5';
    const mockVotes = [
      { player: { nickname: 'player1' } },
      { player: { nickname: 'player2' } }
    ];

    component.votes = mockVotes;
    const result = component.checkVote(playerNickName);

    expect(result).toBeFalse();
  });

  it('si el usuario es admin debe poder revelar las cartas', () => {
    component.registeredPlayer.isAdmin = true;
    component.showCards = false;
    component.onShowCards();
    expect(component.showCards).toBe(true);
  });

  it('si el usuario NO es admin se muestra un mensaje', () => {
    component.registeredPlayer.isAdmin =  false;
    spyOn(toastService, 'showToast');
    component.onShowCards();
    expect(toastService.showToast).toHaveBeenCalledWith('No puedes hacer esto', 3000);
  });

  it('si el usuario es admin puede reiniciar la partida', () => {
    component.registeredPlayer.isAdmin = true;
    component.average = 30;
    component.startNewGame();
    expect(component.average).toBe(0);
  });

  it('si el usuario NO es admin NO puede reiniciar la partida', () => {
    component.registeredPlayer.isAdmin = false;
    component.average = 30;
    spyOn(toastService, 'showToast');
    component.startNewGame();
    expect(toastService.showToast).toHaveBeenCalledWith('No puedes hacer esto', 3000);
  });

  it('si el usurio hace click en invitar jugadores, se muestra la modal', () => {
    component.showInviteModal = false;
    component.onShowModal();
    expect(component.showInviteModal).toBe(true)
  })

  it('si el usuario tipo "player" hace click en cambiar rol, pasa a ser "spectator"', () => {
    component.registeredPlayer.role = "player"
    component.changeRole()
    expect(component.registeredPlayer.role).toBe("spectator")

    component.changeRole()
    expect(component.registeredPlayer.role).toBe("player")

  })

  it('se deben ocultar las cartas cuando el jugador es un espectador', () => {
    component.registeredPlayer.role = 'spectator'; 
    fixture.detectChanges();
    const cardList = fixture.nativeElement.querySelector('.cards');
    expect(cardList).toBeFalsy();
  });

  it('debe alternar el valor de isChangingAdmin', () => {
    component.isChangingAdmin = false

    component.selectNewAdmin();
    expect(component.isChangingAdmin).toBeTrue();

    component.selectNewAdmin();
    expect(component.isChangingAdmin).toBeFalse();
  })

  it('debe darle permisos de administrador al jugador', fakeAsync(() => {
    const mockGameId = 'gameId293';
    component.gameId = mockGameId;

    const mockPlayer: Player = {
      playerId: '1',
      nickname: 'player1',
      role: 'player',
      isAdmin: false,
    }

    spyOn(mockSocketService, 'selectAdmin').and.callThrough();
    component.makeAdmin(mockPlayer);

    tick(); 
    
    expect(mockSocketService.selectAdmin).toHaveBeenCalledWith(mockGameId, mockPlayer);
  }));

  it('debe contar el numero de votos', () => {
    component.votes = [
      { voteValue: 1 },
      { voteValue: 2 },
      { voteValue: 1 },
      { voteValue: 3 },
      { voteValue: 2 },
      { voteValue: 1 }
    ];

    const result = component.countVotes();

    expect(result).toEqual([
      { numberValue: 1, count: 3 },
      { numberValue: 2, count: 2 },
      { numberValue: 3, count: 1 }
    ]);
  });

  it('debe calcular la correcta posicion para un unico jugador', () => {
    const style = component.getPlayerPositionStyle(0, 1);
    expect(style.left).toBe('110%');
    expect(style.top).toBe('50%');
  });
  
  it('debe copiar la URL al portapapeles y mostrar un mensaje', fakeAsync(() => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    spyOn(toastService, 'showToast');

    component.shareLink();
    tick();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(component.url);
    expect(toastService.showToast).toHaveBeenCalledWith('Enlace copiado con exito', 3000);
  }));

  it('si hay un error al copiar el URL, debe mostrar un mensaje', fakeAsync(() => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject());
    spyOn(toastService, 'showToast');

    component.shareLink();
    tick();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(component.url);
    expect(toastService.showToast).toHaveBeenCalledWith('Ha ocurrido un error al copiar el enlace', 3000);
  }));
});
