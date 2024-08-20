import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should return false for names shorter than 5 characters', () => {
    expect(component.validateGameName('abc')).toBeFalse();
    expect(component.errorMessage).toBe('El nombre debe tener entre 5 y 20 caracteres.');
  });

  it('should return false for names longer than 20 characters', () => {
    expect(component.validateGameName('thisisaverylonggamename')).toBeFalse();
    expect(component.errorMessage).toBe('El nombre debe tener entre 5 y 20 caracteres.');
  });

  it('should return false for names with invalid characters', () => {
    expect(component.validateGameName('game_name')).toBeFalse();
    expect(component.errorMessage).toBe('El nombre no puede contener caracteres especiales.');
  });

  it('should return false for names with more than 3 numbers', () => {
    expect(component.validateGameName('game1234')).toBeFalse();
    expect(component.errorMessage).toBe('El nombre no puede tener más de 3 números.');
  });

  it('should return false for names that are only numbers', () => {
    expect(component.validateGameName('12345')).toBeFalse();
    expect(component.errorMessage).toBe('El nombre no puede estar compuesto solo por números.');
  });

  it('should return true for valid game names', () => {
    expect(component.validateGameName('game123')).toBeTrue();
    expect(component.errorMessage).toBeNull();
  });
});
