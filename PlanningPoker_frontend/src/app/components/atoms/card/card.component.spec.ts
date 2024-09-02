import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { ToastService } from '@/services/toast.service';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let toastService: ToastService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardComponent ],
      providers: [ToastService]
    })
    .compileComponents();

    toastService = TestBed.inject(ToastService)
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostrar el diseño de espectador cuando el jugador es un espectador', () => {
    component.playerType = 'spectator'; 
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.card');
    expect(cardElement).toBeTruthy();
    expect(cardElement.classList).toContain('card--spectator'); 
  });

  it('debe emitir el valor si el usuario es de tipo "player"', () => {
    component.playerType = 'player';
    component.value = 42;
    spyOn(component.clickEvent, 'emit');
    component.onClickFn();
    expect(component.clickEvent.emit).toHaveBeenCalledWith(42);
  });

  it('si el usuario no es de tipo "player" no se debe emitir el valor', () => {
    component.playerType = 'spectator';
    spyOn(toastService, 'showToast');
    component.onClickFn();
    expect(toastService.showToast).toHaveBeenCalledWith('No tienes permiso para realizar esta accion', 3000);
  });

});
