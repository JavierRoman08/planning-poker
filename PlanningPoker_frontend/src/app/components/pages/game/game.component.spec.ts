import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from '@/components/navbar/navbar.component';
import { AvatarComponent } from '@/components/atoms/avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from '@/components/atoms/error/error.component';
import { ButtonComponent } from '@/components/atoms/button/button.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameComponent, NavbarComponent, AvatarComponent, ErrorComponent, ButtonComponent],
      imports: [RouterModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'dddd' } },
            paramMap: of({ get: () => 'dddd' })
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
