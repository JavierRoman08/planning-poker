import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from '@/components/molecules/navbar/navbar.component';
import { AvatarComponent } from '@/components/atoms/avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from '@/components/atoms/error/error.component';
import { ButtonComponent } from '@/components/atoms/button/button.component';
import { ToastComponent } from '@/components/atoms/toast/toast.component';
import { ToastService } from '@/services/toast.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
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
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    toastService = TestBed.inject(ToastService)
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('si el usurio hace click en invitar jugadores, se muestra la modal', () => {
    component.showInviteModal = false;
    component.onShowModal();
    expect(component.showInviteModal).toBe(true)
  })

  it('si el usuario tipo "player" hace click en cambiar rol, pasa a ser "spectator"', () => {
    component.registeredPlayer.role = "player"
    component.changeRole()
    expect(component.registeredPlayer.role).toBe("spectator")

  })

  it('debe mostrar el diseño de espectador cuando el jugador es un espectador', () => {
    component.registeredPlayer.role = 'spectator'; 
    fixture.detectChanges();
    const cardList = fixture.nativeElement.querySelector('.cards');
    expect(cardList).toBeFalsy();
  });
});
