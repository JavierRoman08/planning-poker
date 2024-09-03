import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { of } from 'rxjs';
import { ToastService } from '@/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {

    const mockToastService = {
      toastState: of({ message: 'Test Message', duration: 3000 })
    };

    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to toastState and display the message', () => {
    // Verifica que el mensaje se haya establecido correctamente
    expect(component.message).toBe('Test Message');
    // Verifica que el toast sea visible
    expect(component.isVisible).toBeTrue();
  });

  it('should hide the toast after the specified duration', fakeAsync(() => {
    // Llama al método showToast con una duración específica
    component.showToast(3000);
    expect(component.isVisible).toBeTrue(); // Inmediatamente después, el toast debe ser visible

    tick(3000); // Simula el paso del tiempo (3 segundos)

    expect(component.isVisible).toBeFalse(); // Después de 3 segundos, el toast debe estar oculto
  }));
});
