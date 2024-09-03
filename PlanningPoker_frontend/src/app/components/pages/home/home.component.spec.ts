import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { NavbarComponent } from '@/components/molecules/navbar/navbar.component';
import { AvatarComponent } from '@/components/atoms/avatar/avatar.component';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorComponent } from '@/components/atoms/error/error.component';
import { ButtonComponent } from '@/components/atoms/button/button.component';
import { SocketService } from '@/services/socket.service';

class MockSocketService {
  createRoom(gameName: string): Promise<{ gameId: string }> {
    return Promise.resolve({ gameId: '12345' });
  }
}

class MockRouter {
  navigate(commands: any[]): void {}
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockSocketService: MockSocketService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockSocketService = new MockSocketService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, NavbarComponent, AvatarComponent, ErrorComponent, ButtonComponent],
      imports: [RouterModule, FormsModule],
      providers: [
        { provide: SocketService, useValue: mockSocketService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe crear la sala (createRoom) con el GameName y navegar si la validacion es valida', fakeAsync(() => {
    const mockGameName = 'ValidGameName';
    component.gameName = mockGameName;
    
    spyOn(mockSocketService, 'createRoom').and.callThrough();
    spyOn(mockRouter, 'navigate').and.callThrough();

    const form = { value: { gameName: mockGameName } } as NgForm;

    component.createRoom(form);

    tick(); 
    
    expect(mockSocketService.createRoom).toHaveBeenCalledWith(mockGameName);
    expect(component.gameId).toBe('12345');
    expect(component.errorMessage).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game', '12345']);
  }));

  it('error si la validacion falla', fakeAsync(() => {
    const mockGameName = 'InvalidGameName1111';
    component.gameName = mockGameName;
    
    spyOn(mockSocketService, 'createRoom').and.callThrough();
    spyOn(mockRouter, 'navigate').and.callThrough();

    const form = { value: { gameName: mockGameName } } as NgForm;

    component.createRoom(form);

    tick(); 

    expect(mockSocketService.createRoom).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});