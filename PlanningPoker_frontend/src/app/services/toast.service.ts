import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ message: string, duration: number }>();
  toastState = this.toastSubject.asObservable();

  showToast(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, duration });
  }
}
